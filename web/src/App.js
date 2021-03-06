import React, { Component } from 'react';
import { uniqueId } from 'lodash';
import filesize from 'filesize'

import api from './services/api';

import GlobalStyle from './styles/global';
import { Container, Content } from './styles';
import Upload from './components/Upload/index';
import FileList from './components/FileList/index';

class App extends Component {
  state = {
    uploadedFiles: [],
  }

  handleUpload = files => {
    const uploadedFiles = files.map(file => ({
      file,
      id: uniqueId(),
      name: file.name,
      readableSize: filesize(file.size),
      preview: URL.createObjectURL(file),
      progress: 0,
      uploaded: false,
      error: false,
      url: null,
    }));

    this.setState({
      uploadedFiles: this.state.uploadedFiles.concat(uploadedFiles)
    });

    uploadedFiles.forEach(this.processUpload);
  };

  updateFile = (id, data) => {
    this.setState({ 
      uploadedFiles: this.state.uploadedFiles.map(uploadedFiles => {
        return id === uploadedFiles.id 
        ? { ...uploadedFiles, ...data } 
        : uploadedFiles;
      })
    });
  }

  handleDelete = async id => {
    await api.delete(`posts/${id}`);

    this.setState({
      uploadedFiles: this.state.uploadedFiles.filter(file => file.id != id),
    })
  }

  processUpload = uploadedFile => {
    const data = new FormData();

    data.append('file', uploadedFile.file, uploadedFile.name);

    api.post('posts', data, {
      onUploadProgress: e => {
        const progress = parseInt(Math.round((e.loaded * 100) / e.total));

        this.updateFile(uploadedFile.id, {
          progress,
        })
      }
    }).then(response => {
      this.updateFile(uploadedFile.id, {
        uploaded: true,
        id: response.data._id,
        url: response.data.url,
      });
    }).catch(() => {
      this.updateFile(uploadedFile.id, {
        error: true,
      });
    });
  }

  render() {
    const { uploadedFiles } = this.state;

    return (
      <Container>
        <Content>
          <Upload onUpload={this.handleUpload} />
          { !!uploadedFiles.length && (
            <FileList files={uploadedFiles} onDelete={this.handleDelete} />
          ) }
        </Content>
        <GlobalStyle />
      </Container>
    );
  }
}

export default App;
