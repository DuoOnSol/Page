import { useState, useEffect } from 'react';

const MessageBoard = () => {
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState("");

    useEffect(() => {
        const interval = setInterval(() => {
            setMessages((currentMessages) =>
                currentMessages
                    .map((msg) => ({ ...msg, age: msg.age + 1 }))
                    .filter((msg) => msg.age <= 180)
            );
        }, 1000 * 60);

        return () => clearInterval(interval);
    }, []);

    const handleSubmit = () => {
        if (inputMessage.trim() !== "") {
            setMessages((prev) => [
                ...prev,
                { text: inputMessage, age: 0, id: Date.now() },
            ]);
            setInputMessage("");
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-6 flex flex-col items-center">
            <textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Leave your message..."
                className="w-full p-3 mb-4 rounded-lg shadow-md focus:outline-none"
                rows="3"
            />
            <button onClick={handleSubmit} className="mb-6 w-full bg-blue-500 text-white py-2 rounded-lg">Submit</button>
            <div className="w-full space-y-4">
                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className="transition-all duration-1000 ease-in-out p-4 rounded-lg shadow-md bg-white"
                        style={{
                            opacity: Math.max(0, 1 - msg.age / 180),
                            transform: `rotate(${(msg.age / 180) * 360}deg)`
                        }}
                    >
                        {msg.text}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MessageBoard;
