export type AlephState = {
  /**
   * Version 1 of Aleph snap state
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

/**
 * Configuration for Aleph Zero snap
 */
export type AlephConfig = {
  domainConfig: AlephDomainConfig;
};

/**
 * Configuration for Aleph Zero domains
 *
 * We use this to configure which config to use for which domain
 *
 */
export type AlephDomainConfig = {
  [domain: string]: AlephDomainConfigEntry;
};

/**
 * Configuration for a single Aleph Zero domain
 */
export type AlephDomainConfigEntry = {
  rpcUrl: string;
};

/**
 * Account specific storage
 */
export type AlephWalletState = {
  // TODO: Persist imported accounts
};
