"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useProjects } from "@/lib/contexts/projectsContext";
import { Button, Input } from "@/components/UI";
import { Paperclip, CalendarDays, Image, Send, PlusCircle, X } from 'lucide-react';
import { storage, type ChatMessage } from "@/lib/storage";
import { uploadFiles, UploadError, type UploadedFile } from "@/lib/uploadAdapter";
import { meetingService } from "@/lib/meetingService";

type ChatMsg = {
  id: string;
  projectId: string;
  sender: "designer" | "agent";
  text: string;
  ts: number;
  attachments?: {
    type: "image" | "file";
    url: string;
    name: string;
    size?: number;
  }[];
  meetingInfo?: {
    date: string;
    time: string;
    duration: number;
    link: string;
  };
};

const AGENT_NAME = "Agent";

export default function chatPage() {
  const { projects } = useProjects();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load messages
  const loadMessages = useCallback(async (projectId: string) => {
    try {
      setIsLoading(true);
      const msgs = await storage.getMessages(projectId);
      if (msgs.length === 0) {
        // Seed welcome message
        const welcomeMsg: ChatMessage = {
          id: `m_${projectId}_welcome`,
          projectId,
          sender: "agent",
          text: `Hello! I'm your ${AGENT_NAME}. Share requirements or files here — I'll guide you end-to-end.`,
          ts: Date.now(),
        };
        await storage.saveMessage(welcomeMsg);
        setMessages([welcomeMsg]);
      } else {
        setMessages(msgs);
      }
    } catch (err) {
      setError('Failed to load messages');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const [activeProjectId, setActiveProjectId] = useState("");
  
  // Set initial project when projects load
  useEffect(() => {
    if (projects.length > 0 && !activeProjectId) {
      setActiveProjectId(projects[0].id);
    }
  }, [projects, activeProjectId]);
  const thread = useMemo(
    () => messages.filter((m) => m.projectId === activeProjectId).sort((a,b)=>a.ts-b.ts),
    [messages, activeProjectId]
  );

  const [draft, setDraft] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (activeProjectId) {
      loadMessages(activeProjectId);
    }
  }, [activeProjectId, loadMessages]);

  // Messages are now handled by the storage service

  async function sendMessage(text: string, attachments?: UploadedFile[], meetingInfo?: ChatMessage['meetingInfo']) {
    try {
      const msg: ChatMessage = {
        id: `m_${Date.now()}`,
        projectId: activeProjectId,
        sender: "designer",
        text: text.trim(),
        ts: Date.now(),
        ...(attachments && { attachments }),
        ...(meetingInfo && { meetingInfo }),
      };
      await storage.saveMessage(msg);
      setMessages(prev => [...prev, msg]);
      setDraft("");
    } catch (err) {
      setError('Failed to send message');
      console.error(err);
    }
  }

  async function handleUpload(files: FileList, type: 'image' | 'file') {
    try {
      setIsLoading(true);
      const uploaded = await uploadFiles(
        Array.from(files).map(file => ({
          file,
          type,
          projectId: activeProjectId
        }))
      );
      await sendMessage(
        `Shared ${uploaded.length} ${type}${uploaded.length > 1 ? 's' : ''}`,
        uploaded
      );
    } catch (err) {
      if (err instanceof UploadError) {
        setError(err.message);
      } else {
        setError('Failed to upload files');
      }
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }

  async function scheduleMeeting() {
    try {
      setIsLoading(true);
      const date = new Date();
      date.setMinutes(Math.ceil(date.getMinutes() / 30) * 30);

      const meeting = await meetingService.createMeeting({
        projectId: activeProjectId,
        date: date.toISOString().split('T')[0],
        time: date.toTimeString().split(':').slice(0, 2).join(':'),
        duration: 30,
        title: `Design Consultation - ${projects.find(p => p.id === activeProjectId)?.name}`,
      });

      // Create calendar event
      const calendarUrl = meetingService.getCalendarEvent(meeting);

      await sendMessage(
        "I've scheduled a meeting.",
        undefined,
        {
          ...meeting,
          status: 'scheduled'
        }
      );

      // Open calendar event in new tab
      window.open(calendarUrl, '_blank');
    } catch (err) {
      setError('Failed to schedule meeting');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Projects list */}
        <aside className="rounded-2xl border border-zinc-200 bg-[#f2f0ed] p-3">
          <h2 className="text-sm font-semibold text-[#2e2e2e] mb-2">Projects</h2>
          <div className="space-y-1">
            {projects.length === 0 ? (
              <div className="text-center py-8 text-gray-500 text-sm">
                <p>No projects yet.</p>
                <p className="mt-2">Create a project from the dashboard to start chatting with your team!</p>
              </div>
            ) : (
              projects.map((p) => {
                const active = p.id === activeProjectId;
                return (
                  <button
                    key={p.id}
                    onClick={() => setActiveProjectId(p.id)}
                    className={`w-full text-left px-3 py-2 rounded-2xl text-sm ${
                      active
                        ? "bg-[#d96857] text-white"
                        : "bg-white text-[#2e2e2e] border border-zinc-200 hover:bg-white/70"
                    }`}
                  >
                    {p.name}
                    <div className="text-xs opacity-80">{p.scope}</div>
                  </button>
                );
              })
            )}
          </div>
        </aside>

        {/* Chat thread */}
        <section className="md:col-span-2 rounded-2xl border border-zinc-200 overflow-hidden">
          {!activeProjectId || projects.length === 0 ? (
            <div className="flex items-center justify-center h-[70vh] text-gray-500">
              <div className="text-center">
                <div className="text-lg font-medium mb-2">No Project Selected</div>
                <p className="text-sm">Create a project from the dashboard to start chatting with your team.</p>
              </div>
            </div>
          ) : (
            <>
              <div className="p-4 border-b border-zinc-200 bg-white">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-1.5 rounded-full bg-[#d96857]" />
                  <div>
                    <div className="text-sm font-semibold text-[#2e2e2e]">
                      {projects.find((p) => p.id === activeProjectId)?.name}
                    </div>
                    <div className="text-xs text-zinc-500">
                      Team Chat - Design Collaboration
                    </div>
                  </div>
                </div>
              </div>

          <div className="h-[60vh] overflow-y-auto bg-[#f9f9f8] p-4">
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600 flex items-center justify-between">
                <span>{error}</span>
                <Button
                  className="p-1 hover:bg-red-100 rounded-full"
                  onClick={() => setError(null)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            )}
            {thread.map((m) => (
              <div
                key={m.id}
                className={`mb-3 flex ${
                  m.sender === "designer" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[75%] rounded-2xl px-3 py-2 text-sm shadow-sm ${
                    m.sender === "designer"
                      ? "bg-[#d96857] text-white"
                      : "bg-white text-[#2e2e2e] border border-zinc-200"
                  }`}
                >
                  <div className="whitespace-pre-wrap">{m.text}</div>
                  
                  {/* Meeting Info */}
                  {m.meetingInfo && (
                    <div className={`mt-2 p-3 rounded-lg ${
                      m.sender === "designer" ? "bg-[#c85745]" : "bg-zinc-100"
                    }`}>
                      <div className="flex items-center gap-2 text-xs mb-2">
                        <CalendarDays className="w-4 h-4" />
                        <span className="font-medium">Meeting Scheduled</span>
                      </div>
                      <div className="text-xs space-y-1">
                        <div>Date: {m.meetingInfo.date}</div>
                        <div>Time: {m.meetingInfo.time}</div>
                        <div>Duration: {m.meetingInfo.duration} minutes</div>
                        <a 
                          href={m.meetingInfo.link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className={`inline-block mt-2 px-3 py-1 rounded-full text-xs ${
                            m.sender === "designer" 
                              ? "bg-white text-[#d96857]" 
                              : "bg-[#d96857] text-white"
                          }`}
                        >
                          Join Meeting
                        </a>
                      </div>
                    </div>
                  )}

                  {/* Attachments */}
                  {m.attachments && m.attachments.length > 0 && (
                    <div className="mt-2 space-y-2">
                      {m.attachments.map((att, idx) => (
                        <div 
                          key={idx} 
                          className={`p-2 rounded-lg flex items-center gap-2 ${
                            m.sender === "designer" ? "bg-[#c85745]" : "bg-zinc-100"
                          }`}
                        >
                          {att.type === 'image' ? (
                            <Image className="w-4 h-4" />
                          ) : (
                            <Paperclip className="w-4 h-4" />
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="text-xs font-medium truncate">{att.name}</div>
                            {att.size && (
                              <div className="text-[10px] opacity-70">
                                {Math.round(att.size / 1024)}KB
                              </div>
                            )}
                          </div>
                          <a 
                            href={att.url} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className={`p-1 rounded-full ${
                              m.sender === "designer" 
                                ? "hover:bg-[#c85745]" 
                                : "hover:bg-zinc-200"
                            }`}
                          >
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
                            </svg>
                          </a>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="mt-1 text-[10px] opacity-70">
                    {new Date(m.ts).toLocaleString()}
                  </div>
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          <div className="p-3 border-t border-zinc-200 bg-white">
            {/* Quick Actions */}
            <div className="flex items-center gap-2 mb-2">
              <Button
                className="flex items-center gap-1.5 text-xs bg-zinc-100 hover:bg-zinc-200 text-zinc-700 px-3 py-1.5 rounded-full"
                onClick={() => {
                  const input = document.createElement('input');
                  input.type = 'file';
                  input.multiple = true;
                  input.accept = '.pdf,.doc,.docx,.xls,.xlsx,.txt,.zip';
                  input.onchange = (e) => {
                    const files = (e.target as HTMLInputElement).files;
                    if (files?.length) {
                      handleUpload(files, 'file');
                    }
                  };
                  input.click();
                }}
              >
                <Paperclip className="w-3 h-3" />
                Add Files
              </Button>
              
              <Button
                className="flex items-center gap-1.5 text-xs bg-zinc-100 hover:bg-zinc-200 text-zinc-700 px-3 py-1.5 rounded-full"
                onClick={scheduleMeeting}
                disabled={isLoading}
              >
                <CalendarDays className="w-3 h-3" />
                Schedule Meeting
              </Button>
              
              <Button
                className="flex items-center gap-1.5 text-xs bg-zinc-100 hover:bg-zinc-200 text-zinc-700 px-3 py-1.5 rounded-full"
                onClick={() => {
                  const input = document.createElement('input');
                  input.type = 'file';
                  input.accept = 'image/*';
                  input.multiple = true;
                  input.onchange = (e) => {
                    const files = (e.target as HTMLInputElement).files;
                    if (files?.length) {
                      handleUpload(files, 'image');
                    }
                  };
                  input.click();
                }}
                disabled={isLoading}
              >
                <Image className="w-3 h-3" />
                Add Images
              </Button>
            </div>

            {/* Message Input */}
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Input
                  placeholder="Type a message…"
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  className="w-full rounded-2xl pr-10"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      if (draft.trim()) {
                        sendMessage(draft);
                      }
                    }
                  }}
                />
                <Button 
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-zinc-100 rounded-full"
                  onClick={() => {
                    // Open formatting options
                  }}
                >
                  <PlusCircle className="w-5 h-5 text-zinc-400" />
                </Button>
              </div>
              <Button
                onClick={() => draft.trim() && sendMessage(draft)}
                disabled={isLoading || !draft.trim()}
                className="rounded-2xl bg-[#d96857] text-white px-4 py-2 flex items-center gap-2 disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
                Send
              </Button>
            </div>
          </div>
            </>
          )}
        </section>
      </div>
    </main>
  );
}
