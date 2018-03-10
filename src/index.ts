import {
  IDisposable, DisposableDelegate
} from '@phosphor/disposable';

import {
  JupyterLab, JupyterLabPlugin
} from '@jupyterlab/application';

import {
  ToolbarButton
} from '@jupyterlab/apputils';

import {
  DocumentRegistry
} from '@jupyterlab/docregistry';

import {
  NotebookPanel, INotebookModel
} from '@jupyterlab/notebook';

import '../style/index.css';

const plugin: JupyterLabPlugin<void> = {
  activate,
  id: 'jupyterlab_gist',
  autoStart: true
};


export
class GistButtonExtension implements DocumentRegistry.IWidgetExtension<NotebookPanel, INotebookModel> {

  createNew(panel: NotebookPanel, context: DocumentRegistry.IContext<INotebookModel>): IDisposable {

    let gist_url: string = null;
    let gist_id: string = null;
    console.log("dsds");

    let callback = () => {

      const title = panel.title["_label"];
      const content = panel.notebook.model.toString()

      let data: any = {};
      data.description = "Gist for";
      data.public = true;
      data.files = {};
      data.files[title] = {content: content};

      console.log("Sending the gist request now for " + title + ".");

      createGistRequest(data, gist_id)
        .then(data => {
          gist_url = data["html_url"];
          gist_id = data["id"];
          console.log("The gist for " + title + " is available at " + gist_url);
        })
        .catch(error => console.error(error));
    };

    let button = new ToolbarButton({
      className: 'jp-GistButton',
      onClick: callback,
      tooltip: 'Post Gist'
    });

    panel.toolbar.insertItem(9, 'postGist', button);
    return new DisposableDelegate(() => {
      button.dispose();
    });
  }
}

function activate(app: JupyterLab) {
  app.docRegistry.addWidgetExtension('Notebook', new GistButtonExtension());
};

function createGistRequest(data: any, gist_id: string) {
  let url = "https://api.github.com/gists";
  let method = "POST";

  // TODO: as anonymous user I don't think it's possible
  // at the moment to update the current gist.
  // We need to add authentication.
  //if(gist_id != null){
  //  url += "/" + gist_id;
  //  method = "PATCH";
  //}

  return fetch(url, {
    body: JSON.stringify(data),
    cache: 'no-cache',
    credentials: 'same-origin',
    headers: {
      'content-type': 'application/json'
    },
    method: method,
    mode: 'cors',
    redirect: 'follow',
    referrer: 'no-referrer',
  })
  .then(response => response.json())
};


export default plugin;