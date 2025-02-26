export default function LoadingPage() {
    return (
        <div className="w-full h-screen flex flex-col bg-white justify-center items-center">
            <h1 className="text-coffee-dark text-2xl mb-6 font-semibold">
                Loading...
            </h1>
            <div className="w-12 h-12 border-4 border-coffee-dark border-t-transparent border-solid rounded-full animate-spin" />
        </div>
    );
}
