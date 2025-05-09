import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { chatInit, chatMessage } from "../api";

export default function ChatModeloMadurez() {
  const { sessionToken } = useParams<{ sessionToken:string }>();
  const navigate = useNavigate();

  const [msgs, setMsgs]   = useState<{role:string,content:string}[]>([]);
  const [qid, setQid]     = useState<number|null>(null);
  const [opts, setOpts]   = useState<{numeric_value:number,option_text:string}[]>([]);
  const [input, setInput] = useState("");

  useEffect(()=>{
    if (!sessionToken) return;
    chatInit(sessionToken).then(data=>{
      setMsgs(data.messages);
      setQid(data.question_id);
      setOpts(data.options);
    });
  },[sessionToken]);

  const onSend = async () => {
    if (qid==null||!sessionToken) return;
    setMsgs(m=>[...m,{role:"user",content:input}]);
    const data = await chatMessage(sessionToken,qid,parseInt(input,10));
    setMsgs(m=>[...m,...data.messages]);
    if (data.end) {
      alert("Encuesta finalizada");
      navigate("/");
    } else {
      setQid(data.question_id);
      setOpts(data.options);
    }
    setInput("");
  };

  return (
    <div className="h-screen flex flex-col p-6 bg-gray-100">
      <h2 className="text-2xl font-bold mb-4">Chat Modelo de Madurez</h2>
      <div className="flex-1 overflow-auto bg-white p-4 rounded space-y-3">
        {msgs.map((m,i)=>(
          <div key={i} className={m.role==="assistant"?"text-left":"text-right"}>
            <span className={`inline-block px-3 py-2 rounded ${m.role==="assistant"?"bg-gray-200":"bg-blue-600 text-white"}`}>
              {m.content}
            </span>
          </div>
        ))}
      </div>
      <div className="mt-4">
        <input
          type="text"
          className="w-full p-2 border rounded"
          placeholder="Escribe tu respuesta (número)"
          value={input}
          onChange={e=>setInput(e.target.value)}
        />
        <button onClick={onSend} className="mt-2 w-full bg-blue-500 text-white p-2 rounded">
          Enviar
        </button>
      </div>
    </div>
  );
}

