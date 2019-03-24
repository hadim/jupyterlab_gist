//import GitHub from 'github-api';

export class GistService {
  public userName: string = null;
  public name: string = null;
  //private github: GitHub = null;

  constructor(userToken: string) {
    try {
      //console.log(GitHub);
      //this.github = new GitHub({ token: userToken });
    } catch (err) {
      console.error(err);
    }

    // if (userToken !== null && userToken !== '') {
    //   this.github.users
    //     .getAuthenticated({})
    //     .then(res => {
    //       this.userName = res.data.login;
    //       this.name = res.data.name;
    //       console.log(
    //         'Connected to Gist with user : ' + "'" + this.userName + "'",
    //       );
    //     })
    //     .catch(err => {
    //       console.error(err);
    //     });
    // }
  }

  public async publishGist(files: any, gist_id: string): Promise<any> {
    // if (gist_id) {
    //   return await this.github.gists.update({
    //     files: files,
    //     description: '',
    //     gist_id: gist_id,
    //   });
    // }
    // return await this.github.gists.create({
    //   files: files,
    //   description: '',
    //   public: true,
    // });

    // let gist = this.github.getGist(); // not a gist yet
    // gist
    //   .create({
    //     public: true,
    //     description: 'My first gist',
    //     files: {
    //       'file1.txt': {
    //         content: "Aren't gists great!",
    //       },
    //     },
    //   })
    //   .then(function({ data }) {
    //     // Promises!
    //     let createdGist = data;
    //     return gist.read();
    //   })
    //   .then(function({ data }) {
    //     let retrievedGist = data;
    //     // do interesting things
    //   });
  }
}
