import React, { useEffect, useState } from 'react';
import {
  Mail,
  MailOpen,
  Trash2,
  Reply,
  CheckCircle2,
  Calendar,
  User,
  Search,
  Check,
  RotateCcw,
} from 'lucide-react';
import { contactService } from '../../services/contactService';
import { ContactMessage } from '../../types';
import { ConfirmDialog } from '../../components/ConfirmDialog';
import { formatDate } from '../../lib/utils';
import { SEO } from '../../components/SEO';

export const AdminMessages: React.FC = () => {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const loadMessages = async () => {
    try {
      const data = await contactService.getMessages();
      setMessages(data);
    } catch (e) {
      console.error('Error loading messages in admin:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMessages();
  }, []);

  const handleToggleRead = async (msg: ContactMessage, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    try {
      await contactService.markAsRead(msg.id, !msg.read);
      await loadMessages();
      if (selectedMessage?.id === msg.id) {
        setSelectedMessage({ ...selectedMessage, read: !msg.read });
      }
    } catch (err) {
      console.error('Error marking message read:', err);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    try {
      await contactService.deleteMessage(deleteId);
      if (selectedMessage?.id === deleteId) {
        setSelectedMessage(null);
      }
      await loadMessages();
    } catch (err) {
      console.error('Error deleting message:', err);
    } finally {
      setDeleteId(null);
    }
  };

  const handleSelectMessage = async (msg: ContactMessage) => {
    setSelectedMessage(msg);
    if (!msg.read) {
      await contactService.markAsRead(msg.id, true);
      await loadMessages();
    }
  };

  const filteredMessages = messages.filter((msg) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      msg.name.toLowerCase().includes(q) ||
      msg.email.toLowerCase().includes(q) ||
      msg.message.toLowerCase().includes(q) ||
      (msg.subject && msg.subject.toLowerCase().includes(q));

    const matchesFilter =
      filter === 'all' ? true : filter === 'unread' ? !msg.read : msg.read;

    return matchesSearch && matchesFilter;
  });

  const unreadCount = messages.filter((m) => !m.read).length;

  return (
    <div className="space-y-8 max-w-6xl">
      <SEO title="Buzón de Mensajes | Admin" description="Gestión de mensajes de contacto." />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Buzón de Contacto
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Revisa y responde los mensajes enviados desde el formulario web.
          </p>
        </div>

        {unreadCount > 0 && (
          <span className="px-3.5 py-1 rounded-full text-xs font-semibold bg-rose-950 text-rose-300 border border-rose-800 flex items-center gap-1.5 w-fit">
            <Mail className="w-3.5 h-3.5" />
            <span>{unreadCount} sin leer</span>
          </span>
        )}
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-neutral-900 border border-neutral-800">
        <div className="relative w-full sm:max-w-md">
          <Search className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar remitente, correo o contenido..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs bg-neutral-800 text-white rounded-xl border border-neutral-700 focus:outline-none focus:border-sky-500"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto">
          {[
            { label: 'Todos', value: 'all' },
            { label: 'Sin leer', value: 'unread' },
            { label: 'Leídos', value: 'read' },
          ].map((tab) => (
            <button
              key={tab.value}
              onClick={() => setFilter(tab.value as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                filter === tab.value
                  ? 'bg-sky-600 text-white shadow'
                  : 'bg-neutral-800 text-neutral-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Split View: List on left, Reader on right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Messages List */}
        <div className="lg:col-span-5 space-y-3">
          {loading ? (
            [1, 2, 3].map((i) => (
              <div key={i} className="h-24 rounded-2xl bg-neutral-900 animate-pulse" />
            ))
          ) : filteredMessages.length === 0 ? (
            <div className="p-8 text-center bg-neutral-900 rounded-3xl border border-neutral-800">
              <Mail className="w-8 h-8 text-neutral-600 mx-auto mb-2" />
              <p className="text-xs text-neutral-400">No hay mensajes en este buzón.</p>
            </div>
          ) : (
            filteredMessages.map((msg) => {
              const isSelected = selectedMessage?.id === msg.id;
              return (
                <div
                  key={msg.id}
                  onClick={() => handleSelectMessage(msg)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-sky-950/40 border-sky-500/80 shadow-lg'
                      : msg.read
                      ? 'bg-neutral-900/60 border-neutral-800 hover:border-neutral-700'
                      : 'bg-neutral-900 border-sky-500/40 shadow-sm'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      {!msg.read && (
                        <span className="w-2 h-2 rounded-full bg-sky-400 shrink-0" />
                      )}
                      <span className="text-xs font-bold text-white truncate max-w-[150px]">
                        {msg.name}
                      </span>
                    </div>
                    <span className="text-[10px] text-neutral-500 font-mono">
                      {formatDate(msg.created_at)}
                    </span>
                  </div>

                  <p className="text-xs font-semibold text-neutral-300 truncate">
                    {msg.subject || 'Sin asunto'}
                  </p>
                  <p className="text-[11px] text-neutral-400 line-clamp-2 mt-1">
                    {msg.message}
                  </p>
                </div>
              );
            })
          )}
        </div>

        {/* Message Reader Pane */}
        <div className="lg:col-span-7">
          {selectedMessage ? (
            <div className="p-6 sm:p-8 rounded-3xl bg-neutral-900 border border-neutral-800 space-y-6 shadow-xl">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-5">
                <div>
                  <h2 className="text-lg font-bold text-white">
                    {selectedMessage.subject || 'Sin asunto'}
                  </h2>
                  <div className="flex items-center gap-2 mt-1 text-xs text-neutral-400">
                    <span className="font-semibold text-white">{selectedMessage.name}</span>
                    <span>•</span>
                    <a
                      href={`mailto:${selectedMessage.email}`}
                      className="text-sky-400 hover:underline"
                    >
                      {selectedMessage.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => handleToggleRead(selectedMessage, e)}
                    className="p-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white transition-colors"
                    title={selectedMessage.read ? 'Marcar como no leído' : 'Marcar como leído'}
                  >
                    {selectedMessage.read ? (
                      <Mail className="w-4 h-4" />
                    ) : (
                      <MailOpen className="w-4 h-4" />
                    )}
                  </button>

                  <button
                    onClick={() => setDeleteId(selectedMessage.id)}
                    className="p-2 rounded-xl bg-neutral-800 hover:bg-red-500/20 text-neutral-300 hover:text-red-400 transition-colors"
                    title="Eliminar mensaje"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Message Content */}
              <div className="text-sm text-neutral-200 leading-relaxed whitespace-pre-line min-h-[150px] font-sans">
                {selectedMessage.message}
              </div>

              {/* Reply Button */}
              <div className="pt-4 border-t border-neutral-800 flex items-center justify-between">
                <span className="text-xs text-neutral-500 font-mono">
                  Recibido el {formatDate(selectedMessage.created_at)}
                </span>

                <a
                  href={`mailto:${selectedMessage.email}?subject=Re: ${encodeURIComponent(
                    selectedMessage.subject || 'Contacto'
                  )}`}
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-neutral-950 font-bold text-xs shadow transition-transform hover:scale-105"
                >
                  <Reply className="w-4 h-4" />
                  <span>Responder por Correo</span>
                </a>
              </div>
            </div>
          ) : (
            <div className="p-12 rounded-3xl bg-neutral-900 border border-neutral-800 text-center space-y-3">
              <MailOpen className="w-10 h-10 text-neutral-600 mx-auto" />
              <h3 className="text-sm font-bold text-white">Selecciona un mensaje</h3>
              <p className="text-xs text-neutral-500 max-w-xs mx-auto">
                Haz clic en cualquier mensaje del listado para leer su contenido completo y responder.
              </p>
            </div>
          )}
        </div>
      </div>

      <ConfirmDialog
        isOpen={Boolean(deleteId)}
        title="Eliminar Mensaje"
        message="¿Estás seguro de que deseas eliminar este mensaje de contacto?"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
};
