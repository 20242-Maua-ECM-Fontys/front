export const UploadRoute = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-blue-900 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md rounded-lg bg-gray-100 p-5 shadow-lg">
        <div className="cursor-pointer border-2 border-dashed border-gray-400 p-8 text-center">
          <span className="material-symbols-outlined text-6xl text-gray-500">
            upload
          </span>

          <p className="text-gray-500">Drag and drop files to upload</p>
          <p className="mt-1 text-sm text-gray-400">or</p>
          <button className="focus:shadow-outline mt-3 h-7 rounded-lg border border-blue-600 px-5 text-gray-500 transition-colors duration-150 hover:bg-blue-700 hover:text-gray-100">
            Browse files
          </button>
        </div>
        <div className="mt-4 flex justify-between">
          <button className="rounded bg-gray-400 px-4 py-2 text-white hover:bg-gray-500">
            Cancel
          </button>
          <button className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};
