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


import {
  JSONObject
} from '@phosphor/coreutils';

import '../style/index.css';

const plugin: JupyterLabPlugin<void> = {
  activate,
  id: 'jupyterlab_gist',
  autoStart: true
};

export
interface IGistInfoMetadata extends  JSONObject {
  gist_url?: string;
  gist_id?: string;
}

export
class GistButtonExtension implements DocumentRegistry.IWidgetExtension<NotebookPanel, INotebookModel> {

  createNew(panel: NotebookPanel, context: DocumentRegistry.IContext<INotebookModel>): IDisposable {

    const metadata = panel.notebook.model.metadata;

    // Init notebook metadata
    if(!metadata.has("gist_info")) {
    	metadata.set("gist_info", { gist_url: null, gist_id: null });
    }
    const gist_info = metadata.get('gist_info') as IGistInfoMetadata;

    let postGistCallback = () => {

      const title = panel.title["_label"];
      const content = panel.notebook.model.toString()

      let data: any = {};
      data.description = "Gist for";
      data.public = true;
      data.files = {};
      data.files[title] = {content: content};

      console.log("Sending the gist request now for " + title + ".");

      postGistRequest(data, gist_info["gist_id"])
        .then(data => {
          gist_info["gist_url"] = data["html_url"];
          gist_info["gist_id"] = data["id"];

          console.log("The gist for " + title + " is available at " + gist_info["gist_url"]);

          // Need to be authtenticated to delete gist
          deleteButton.setHidden(true);
          copyURLButton.setHidden(false);
        })
        .catch(error => console.error(error));
    };

    const postButton = new ToolbarButton({
      className: 'jp-PostGistButton',
      onClick: postGistCallback,
      tooltip: 'Post Gist'
    });
    panel.toolbar.insertItem(9, 'postGist', postButton);

    let deleteGistCallback = () => {

      deleteGistRequest(gist_info["gist_id"])
        .then(() => {
          console.log("Delete gist for " + panel.title["_label"] + ": " + gist_info["gist_url"]);
          deleteButton.setHidden(true);
          copyURLButton.setHidden(true);
        })
        .catch(error => console.error(error));
    };

    // Add delete button if a gist_info["gist_url"] exists
    const deleteButton = new ToolbarButton({
      className: 'jp-DeleteGistButton',
      onClick: deleteGistCallback,
      tooltip: 'Delete Gist'
    });
    panel.toolbar.insertItem(10, 'deleteGist', deleteButton);

    let copyURLGistCallback = () => {
      copyToClipboard(gist_info["gist_url"]);
      console.log("URL copied to clipboard");
      console.log("The gist for " + panel.title["_label"] + " is available at " + gist_info["gist_url"]);
    };

    // Add copy url button if a gist_info["gist_url"] exists
    const copyURLButton = new ToolbarButton({
      className: 'jp-CopyURLGistButton',
      onClick: copyURLGistCallback,
      tooltip: 'Copy URL Gist to clipboard'
    });
    panel.toolbar.insertItem(11, 'copyURLGist', copyURLButton);

    if(gist_info["gist_id"] == null) {
      deleteButton.setHidden(true);
      copyURLButton.setHidden(true);
    }

    // Need to be authtenticated to delete gist
    deleteButton.setHidden(true);

    return new DisposableDelegate(() => {
      postButton.dispose();
      deleteButton.dispose();
    });
  }
}

function activate(app: JupyterLab) {
  app.docRegistry.addWidgetExtension('Notebook', new GistButtonExtension());
};

function postGistRequest(data: any, gist_id: string) {
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

function deleteGistRequest(gist_id: string) {
  let url = "https://api.github.com/gists/" + gist_id;
  let method = "DELETE";

  return fetch(url, {
    cache: 'no-cache',
    credentials: 'same-origin',
    method: method,
    mode: 'cors',
    redirect: 'follow',
    referrer: 'no-referrer',
  })
  .then(response => response.json())
};

function copyToClipboard(text: string) {
  var dummy = document.createElement("input");
  document.body.appendChild(dummy);
  dummy.setAttribute('value', text);
  dummy.select();
  document.execCommand("copy");
  document.body.removeChild(dummy);
};

export default plugin;