import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { chatInit, chatMessage } from '../api/admin';

export default function ChatModeloMadurez() {
  const { sessionToken } = useParams();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [questionId, setQuestionId] = useState(null);
  const [isLast, setIsLast] = useState(false);

  useEffect(() => {
    if (!sessionToken) return;
    chatInit(sessionToken)
      .then(r => {
        setMessages(r.data.messages);
        setQuestionId(r.data.question_id);
      })
      .catch(console.error);
  }, [sessionToken]);

  const send = () => {
    setMessages(m => [...m, { role:'user', content: input }]);
    chatMessage({
      session_token: sessionToken,
      question_id: questionId,
      answer: input
    }).then(r => {
      if (r.data.end) {
        setMessages(m => [...m, { role:'assistant', content:'¡Encuesta finalizada!' }]);
        setIsLast(true);
      } else {
        setMessages(m => [...m, ...r.data.messages]);
        setQuestionId(r.data.question_id);
      }
    });
    setInput('');
  };

  return (
    <div className="h-screen flex flex-col p-4 bg-gray-100">
      <div className="flex-1 overflow-auto space-y-4">
        {messages.map((m,i)=>(
          <div key={i} className={m.role==='assistant' ? 'text-left' : 'text-right'}>
            <div className={`inline-block px-4 py-2 rounded ${
              m.role==='assistant' ? 'bg-gray-200' : 'bg-blue-600 text-white'
            }`}>
              {m.content}
            </div>
          </div>
        ))}
      </div>

      {!isLast && (
        <div className="flex gap-2">
          <input
            value={input}
            onChange={e=>setInput(e.target.value)}
            className="flex-1 p-2 border rounded"
            placeholder="Escribe tu respuesta…"
          />
          <button
            onClick={send}
            className="bg-blue-500 text-white p-2 rounded"
          >
            Enviar
          </button>
        </div>
      )}

      {isLast && (
        <button
          onClick={()=>window.location.href=import.meta.env.VITE_FE_ROOT}
          className="mt-4 w-full bg-green-600 text-white p-3 rounded"
        >
          Cerrar cuestionario
        </button>
      )}
    </div>
  );
}
