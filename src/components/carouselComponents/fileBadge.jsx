import {
  FileImage,
  FilePlus2,
  FileText
} from 'lucide-react';

const MAX_NAME_LENGTH = 14;

const getFileIcon = (type) => {
  const supportedTextTypes = [
    'application/pdf',
    'text/plain',
    'text/markdown',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
    'text/html',
  ];

  if (supportedTextTypes.includes(type)) {
    return <FileText className="w-4 h-4 text-blue-500" />;
  }

  if (type.startsWith('image/')) {
    return <FileImage className="w-4 h-4 text-green-500" />;
  }

  return <FilePlus2 className="w-4 h-4 text-gray-500" />;
};

const truncateName = (name) => {
  if (name.length <= MAX_NAME_LENGTH) return name;
  const ext = name.split('.').pop();
  return name.slice(0, MAX_NAME_LENGTH) + '...' + '.' + ext;
};

const FileBadge = ({ file, onRemove, messageBadge }) => {
  return (
    <div className="flex text-black items-center bg-gray-100 rounded-full px-3 py-1 text-sm shadow-sm max-w-xs">
      <div className="flex items-center gap-1">
        {getFileIcon(file.type)}
        <span className="truncate max-w-[120px]">{truncateName(file.name)}</span>
      </div>
      {!messageBadge && (
        <button
          onClick={onRemove}
          className="ml-2 text-gray-500 hover:text-red-500 transition cursor-pointer"
        >
          &times;
        </button>
      )}
    </div>
  );
};

export default FileBadge;
