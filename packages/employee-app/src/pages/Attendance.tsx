import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Clock, CheckCircle, XCircle, MapPin, Wifi, WifiOff, AlertCircle } from 'lucide-react';
import api from '../api/client';
import { useAuthStore } from '../stores/authStore';
import { format } from 'date-fns';

export default function Attendance() {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const today = format(new Date(), 'yyyy-MM-dd');

  const { data: attendanceData } = useQuery({
    queryKey: ['hr-attendance', today],
    queryFn: async () => { const r = await api.get(`/hr/attendance?date=${today}`); return r.data; },
  });

  const { data: historyData } = useQuery({
    queryKey: ['hr-attendance-history'],
    queryFn: async () => { const r = await api.get(`/hr/attendance`); return r.data; },
  });

  const clockIn = useMutation({
    mutationFn: async () => { await api.post('/hr/attendance', { employeeId: user?.employeeId, date: today, clockIn: new Date().toISOString(), status: 'PRESENT' }); },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['hr-attendance'] }),
  });

  const clockOut = useMutation({
    mutationFn: async (id: string) => { await api.put(`/hr/attendance/${id}`, { clockOut: new Date().toISOString() }); },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['hr-attendance'] }),
  });

  const records = Array.isArray(attendanceData?.records) ? attendanceData.records : Array.isArray(attendanceData) ? attendanceData : [];
  const todayRecord = records.find((r: any) => r.date?.startsWith(today));
  const history = Array.isArray(historyData?.records) ? historyData.records : Array.isArray(historyData) ? historyData : [];

  return (
    <div className="space-y-5 pb-24 animate-in">
      <h1 className="text-xl font-bold px-1">Attendance</h1>

      <div className="card p-6">
        <div className="text-center mb-5">
          <div className="text-4xl font-mono font-bold text-slate-900 dark:text-white">{format(new Date(), 'HH:mm:ss')}</div>
          <div className="text-sm text-slate-500 mt-1">{format(new Date(), 'EEEE, MMMM d, yyyy')}</div>
        </div>

        <div className="flex gap-3 mb-4">
          {todayRecord?.clockIn && (
            <div className="flex-1 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl p-3 text-center">
              <CheckCircle className="w-5 h-5 text-emerald-500 mx-auto mb-1" />
              <div className="text-xs text-slate-500">Clock In</div>
              <div className="font-bold text-emerald-600 dark:text-emerald-400">{new Date(todayRecord.clockIn).toLocaleTimeString()}</div>
            </div>
          )}
          {todayRecord?.clockOut && (
            <div className="flex-1 bg-rose-50 dark:bg-rose-900/20 rounded-xl p-3 text-center">
              <XCircle className="w-5 h-5 text-rose-500 mx-auto mb-1" />
              <div className="text-xs text-slate-500">Clock Out</div>
              <div className="font-bold text-rose-600 dark:text-rose-400">{new Date(todayRecord.clockOut).toLocaleTimeString()}</div>
            </div>
          )}
        </div>

        {!todayRecord ? (
          <button onClick={() => clockIn.mutate()} disabled={clockIn.isPending}
            className="w-full py-4 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-xl font-bold text-base flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 active:scale-[0.97]">
            {clockIn.isPending ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Clock className="w-5 h-5" /> Clock In</>}
          </button>
        ) : !todayRecord.clockOut ? (
          <button onClick={() => clockOut.mutate(todayRecord.id)} disabled={clockOut.isPending}
            className="w-full py-4 bg-gradient-to-r from-red-500 to-rose-600 text-white rounded-xl font-bold text-base flex items-center justify-center gap-2 shadow-lg shadow-red-500/20 active:scale-[0.97]">
            {clockOut.isPending ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Clock className="w-5 h-5" /> Clock Out</>}
          </button>
        ) : (
          <div className="text-center text-sm text-slate-500 py-2">Today's shift completed</div>
        )}
      </div>

      <div>
        <h2 className="text-base font-semibold mb-3 px-1">Recent History</h2>
        {history.length === 0 ? (
          <div className="card p-6 text-center text-slate-500 text-sm">No attendance records</div>
        ) : (
          <div className="space-y-2">
            {history.slice(0, 7).map((r: any, i: number) => (
              <div key={r.id || i} className="card p-3 flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium">{r.date ? format(new Date(r.date), 'MMM d') : '-'}</div>
                  <div className="text-xs text-slate-500">{r.status}</div>
                </div>
                <div className="text-right text-xs text-slate-500">
                  {r.clockIn && <div>In: {new Date(r.clockIn).toLocaleTimeString()}</div>}
                  {r.clockOut && <div>Out: {new Date(r.clockOut).toLocaleTimeString()}</div>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
