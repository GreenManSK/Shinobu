import {useState} from 'react';

function App() {
    const [count, setCount] = useState(0);

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 text-gray-800">
            <h1 className="mb-6 text-4xl font-bold text-blue-600">
                Vite + React
            </h1>
            <div className="card rounded-lg bg-white p-6 shadow-md">
                <button
                    className="rounded-lg bg-blue-500 px-4 py-2 text-white transition hover:bg-blue-600"
                    onClick={() => setCount((count) => count + 1)}
                >
                    count is {count}
                </button>
                <p className="mt-4 text-gray-600">
                    Edit{' '}
                    <code className="rounded bg-gray-200 px-1">
                        src/App.tsx
                    </code>{' '}
                    and save to test HMR
                </p>
            </div>
            <p className="read-the-docs mt-6 text-sm text-gray-500">
                Click on the Vite and React logos to learn more
            </p>
        </div>
    );
}

export default App;
