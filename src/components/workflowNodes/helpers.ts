export const getStatusStyle = (status: string | undefined) => {
  switch (status) {
    case "running":
      return "border-blue-500 ring-2 ring-blue-300 animate-pulse bg-blue-50";
    case "completed":
      return "border-green-500 bg-green-50";
    case "failed":
      return "border-red-500 bg-red-50";
    default: // idle
      return "border-gray-200 hover:border-purple-400 bg-white";
  }
};
