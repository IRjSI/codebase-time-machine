export function ErrorState({ message }: { message: string }) {
    return (
        <div className="text-center mt-20">
            <h2 className="text-xl font-semibold">Analysis Failed</h2>
            <p className="text-gray-500 mt-2">{message}</p>
        </div>
    );
}