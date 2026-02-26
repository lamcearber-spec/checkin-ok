'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import type { ParsedAttendance, AttendanceRecord, AiCorrection } from '@/schema/attendanceSchema';

interface AttendanceContextType {
  parsedData: ParsedAttendance | null;
  setParsedData: (data: ParsedAttendance | null) => void;
  fileName: string;
  setFileName: (name: string) => void;
  approveCorrection: (correction: AiCorrection) => void;
  rejectCorrection: (rowIndex: number) => void;
  approveAllCorrections: () => void;
  kpi: { totalScans: number; aiCorrections: number; apiFaults: number };
  setKpi: (kpi: { totalScans: number; aiCorrections: number; apiFaults: number }) => void;
}

const AttendanceContext = createContext<AttendanceContextType | undefined>(undefined);

export function AttendanceProvider({ children }: { children: ReactNode }) {
  const [parsedData, setParsedData] = useState<ParsedAttendance | null>(null);
  const [fileName, setFileName] = useState('');
  const [kpi, setKpi] = useState({ totalScans: 0, aiCorrections: 0, apiFaults: 0 });

  const approveCorrection = (correction: AiCorrection) => {
    if (!parsedData) return;

    const correctedRecord: AttendanceRecord = {
      ...correction.originalRow,
      niss: correction.correctedNiss || correction.originalRow.niss,
      dateOfPresence: correction.correctedDate || correction.originalRow.dateOfPresence,
      workerName: correction.correctedName || correction.originalRow.workerName,
      limosaId: correction.correctedLimosaId || correction.originalRow.limosaId,
      timeOfArrival: correction.correctedArrival || correction.originalRow.timeOfArrival,
      timeOfDeparture: correction.correctedDeparture || correction.originalRow.timeOfDeparture,
    };

    setParsedData({
      ...parsedData,
      validRows: [...parsedData.validRows, correctedRecord],
      aiCorrections: parsedData.aiCorrections.filter((c) => c.rowIndex !== correction.rowIndex),
      invalidRows: parsedData.invalidRows.filter((r) => r.rowIndex !== correction.rowIndex),
    });
  };

  const rejectCorrection = (rowIndex: number) => {
    if (!parsedData) return;
    setParsedData({
      ...parsedData,
      aiCorrections: parsedData.aiCorrections.filter((c) => c.rowIndex !== rowIndex),
    });
  };

  const approveAllCorrections = () => {
    if (!parsedData) return;

    const newValid = parsedData.aiCorrections.map((correction) => ({
      ...correction.originalRow,
      niss: correction.correctedNiss || correction.originalRow.niss,
      dateOfPresence: correction.correctedDate || correction.originalRow.dateOfPresence,
      workerName: correction.correctedName || correction.originalRow.workerName,
      limosaId: correction.correctedLimosaId || correction.originalRow.limosaId,
      timeOfArrival: correction.correctedArrival || correction.originalRow.timeOfArrival,
      timeOfDeparture: correction.correctedDeparture || correction.originalRow.timeOfDeparture,
    }));

    setParsedData({
      ...parsedData,
      validRows: [...parsedData.validRows, ...newValid],
      aiCorrections: [],
      invalidRows: parsedData.invalidRows.filter(
        (r) => !parsedData.aiCorrections.some((c) => c.rowIndex === r.rowIndex)
      ),
    });
  };

  return (
    <AttendanceContext.Provider
      value={{ parsedData, setParsedData, fileName, setFileName, approveCorrection, rejectCorrection, approveAllCorrections, kpi, setKpi }}
    >
      {children}
    </AttendanceContext.Provider>
  );
}

export function useAttendance() {
  const context = useContext(AttendanceContext);
  if (!context) throw new Error('useAttendance must be used within AttendanceProvider');
  return context;
}
