export type AlephState = {
  /**
   * Version 1 of Masca state
   */
  v1: {
    /**
     * Account specific storage
     */
    walletState: Record<string, AlephWalletState>;
    /**
     * Current account
     */
    currentAccount: string;
    /**
     * Configuration for Aleph Zero
     */
    config: AlephConfig;
  };
};

export type AlephConfig = {
  rpcUrl: string;
};

export type AlephWalletState = {
  // TODO: Persist imported accounts
};
