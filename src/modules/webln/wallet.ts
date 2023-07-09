import { requestProvider, MissingProviderError, WebLNProvider } from "webln";

class _Wallet_Service {
    isConnected = false;
    webln: WebLNProvider | null = null;
  
    async getWebln() {
      if (!this.isConnected) await this.connectWallet();
      return this.webln;
    }
  
    init() {
      // const connectedPreviously = localStorage.getItem('wallet-connected')
      // if (connectedPreviously)
      //     this.connectWallet();
    }

    async connectWallet() {
        try {
          const webln = await requestProvider();
          this.webln = webln;
          this.isConnected = false;
        } catch (err: any) {
          // Default error message
          let message =
            "Check out https://getalby.com to get a web enabled lightning wallet";
          // If they didn't have a provider, point them to Joule
          if (err.constructor === MissingProviderError) {
            message =
              "Check out https://getalby.com to get a web enabled lightning wallet";
          }
    
          console.log(message);
    
          // Show the error (though you should probably use something better than alert!)
          
        }
      }
    }
    
    const Wallet_Service = new _Wallet_Service();
    export default Wallet_Service;