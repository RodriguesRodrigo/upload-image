import React from 'react';
import { CircularProgressbar } from 'react-circular-progressbar';
import { MdCheckCircle, MdError, MdLink } from 'react-icons/md';

import { Container, FileInfo, Preview } from './styles';

const FileList = ({ files, onDelete }) => (
    <Container>
        {files.map(uploadedFile => (
            <li key={uploadedFile.id}>
                <FileInfo>
                    <Preview src={uploadedFile.preview} />
                    <div>
                        <strong>{uploadedFile.name}</strong>
                        <span>
                            {uploadedFile.readableSize}
                            {uploadedFile.url && (
                                <button onClick={() => onDelete(uploadedFile.id)}>Excluir</button>
                            )}
                        </span>
                    </div>
                </FileInfo>

                <div>
                    {!uploadedFile.uploaded && !uploadedFile.error && (
                        <CircularProgressbar
                            styles={{
                                root: { width: 24 },
                                path: { stroke: '#7159c1' }
                            }}
                            strokeWidth={10}
                            percetage={uploadedFile.progress}
                        />
                    )}

                    {uploadedFile.url && (
                        <a
                            href="http://localhost:3000/files/0e3b3539e34234c294b4e9c74f833871-bau.png"
                            target="_blank"
                            rel="noonpener noreferrer"
                        >
                            <MdLink style={{ marginRight: 8 }} size={24} color="#222222" />
                        </a>
                    )}

                    {uploadedFile.uploaded && <MdCheckCircle size={24} color="#78e5d5" />}
                    {uploadedFile.error && <MdError size={24} color="#e57878" />}
                </div>
            </li>
        ))}
    </Container>
);

export default FileList;
