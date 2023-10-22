import * as azeroSnap from 'azero-wallet-adapter';
import { TransactionInfo } from 'azero-wallet-types';
import { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';

import {
  Card,
  ConnectButton,
  InstallFlaskButton,
  ReconnectButton,
  SendHelloButton as SendTxButton,
  SetRpcUrlButton,
} from '../components';
import { MetamaskActions, MetaMaskContext } from '../hooks';
import {
  connectSnap,
  getSnap,
  sendTransferToSelfUsingLocalPayload,
  shouldDisplayReconnectButton,
} from '../utils';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  margin-top: 7.6rem;
  margin-bottom: 7.6rem;

  ${({ theme }) => theme.mediaQueries.small} {
    padding-left: 2.4rem;
    padding-right: 2.4rem;
    margin-top: 2rem;
    margin-bottom: 2rem;
    width: auto;
  }
`;

const Heading = styled.h1`
  margin-top: 0;
  margin-bottom: 2.4rem;
  text-align: center;
`;

const Span = styled.span`
  color: ${(props) => props.theme.colors.primary.default};
`;

const Subtitle = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.large};
  font-weight: 500;
  margin-top: 0;
  margin-bottom: 0;

  ${({ theme }) => theme.mediaQueries.small} {
    font-size: ${({ theme }) => theme.fontSizes.text};
  }
`;

const CardContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  max-width: 64.8rem;
  width: 100%;
  height: 100%;
  margin-top: 1.5rem;
`;

const Notice = styled.div`
  background-color: ${({ theme }) => theme.colors.background.alternative};
  border: 1px solid ${({ theme }) => theme.colors.border.default};
  color: ${({ theme }) => theme.colors.text.alternative};
  border-radius: ${({ theme }) => theme.radii.default};
  padding: 2.4rem;
  margin-top: 2.4rem;
  max-width: 60rem;
  width: 100%;

  & > * {
    margin: 0;
  }

  ${({ theme }) => theme.mediaQueries.small} {
    margin-top: 1.2rem;
    padding: 1.6rem;
  }
`;

const ErrorMessage = styled.div`
  background-color: ${({ theme }) => theme.colors.error.muted};
  border: 1px solid ${({ theme }) => theme.colors.error.default};
  color: ${({ theme }) => theme.colors.error.alternative};
  border-radius: ${({ theme }) => theme.radii.default};
  padding: 2.4rem;
  margin-bottom: 2.4rem;
  margin-top: 2.4rem;
  max-width: 60rem;
  width: 100%;

  ${({ theme }) => theme.mediaQueries.small} {
    padding: 1.6rem;
    margin-bottom: 1.2rem;
    margin-top: 1.2rem;
    max-width: 100%;
  }
`;

const Index = () => {
  const [state, dispatch] = useContext(MetaMaskContext);

  const [account, setAccount] = useState<string | null>(null);
  const [txInfo, setTxInfo] = useState<TransactionInfo | null>(null);
  const [rpcUrl, setRpcUrl] = useState<string>('https://test.azero.dev/');

  useEffect(() => {
    const fetchAccount = async () => {
      const accountAddress = await azeroSnap.getAccount();
      setAccount(accountAddress.address);
    };

    if (state.installedSnap) {
      fetchAccount().catch((error) => {
        console.error(error);
        dispatch({ type: MetamaskActions.SetError, payload: error });
      });
    }
  }, [state.installedSnap]);

  const handleConnectClick = async () => {
    try {
      await connectSnap();
      const installedSnap = await getSnap();

      dispatch({
        type: MetamaskActions.SetInstalled,
        payload: installedSnap,
      });
    } catch (error) {
      console.error(error);
      dispatch({ type: MetamaskActions.SetError, payload: error });
    }
  };

  const sendTransferToSelf = async () => {
    try {
      const transactionInfo = await sendTransferToSelfUsingLocalPayload();
      // Alternatively, use:
      // const transactionInfo = await sendTransferToSelfUsingSnapPayload();
      setTxInfo(transactionInfo.transaction);
    } catch (error) {
      console.error(error);
      dispatch({ type: MetamaskActions.SetError, payload: error });
    }
  };

  return (
    <Container>
      <Heading>
        Welcome to <Span>azero-wallet</Span>
      </Heading>
      <Subtitle>Get started by editing by installing the snap:</Subtitle>
      <CardContainer>
        {state.error && (
          <ErrorMessage>
            <b>An error happened:</b> {state.error.message}
          </ErrorMessage>
        )}
        {!state.isFlask && (
          <Card
            content={{
              title: 'Install',
              description:
                'Snaps is pre-release software only available in MetaMask Flask, a canary distribution for developers with access to upcoming features.',
              button: <InstallFlaskButton />,
            }}
            fullWidth
          />
        )}
        {!state.installedSnap && (
          <Card
            content={{
              title: 'Connect',
              description:
                'Get started by connecting to and installing the example snap.',
              button: (
                <ConnectButton
                  onClick={handleConnectClick}
                  disabled={!state.isFlask}
                />
              ),
            }}
            disabled={!state.isFlask}
          />
        )}
        {shouldDisplayReconnectButton(state.installedSnap) && (
          <Card
            content={{
              title: 'Reconnect',
              description:
                'While connected to a local running snap this button will always be displayed in order to update the snap if a change is made.',
              button: (
                <ReconnectButton
                  onClick={handleConnectClick}
                  disabled={!state.installedSnap}
                />
              ),
            }}
            disabled={!state.installedSnap}
          />
        )}
        <Card
          content={{
            title: 'Active Aleph-Zero Account',
            description: `Account derived from your MetaMask account: ${
              account ?? '...'
            }\nMake sure to fund it with some testnet $AZERO to be able to send transactions.`,
          }}
          disabled={!state.installedSnap}
          fullWidth={
            state.isFlask &&
            Boolean(state.installedSnap) &&
            !shouldDisplayReconnectButton(state.installedSnap)
          }
        />
        <Card
          content={{
            title: 'Send a transaction',
            description: 'Sends a transfer to self',
            button: (
              <SendTxButton
                onClick={sendTransferToSelf}
                disabled={!state.installedSnap}
              />
            ),
          }}
          disabled={!state.installedSnap}
          fullWidth={
            state.isFlask &&
            Boolean(state.installedSnap) &&
            !shouldDisplayReconnectButton(state.installedSnap)
          }
        />
        <Card
          content={{
            title: 'Set RPC URL',
            description: 'Set the RPC URL to use for the snap',
            input: (
              <input
                type="text"
                value={rpcUrl}
                onChange={(ev) => setRpcUrl(ev.target.value)}
              />
            ),
            button: (
              <SetRpcUrlButton
                onClick={sendTransferToSelf}
                disabled={!state.installedSnap}
              />
            ),
          }}
          disabled={!state.installedSnap}
          fullWidth={
            state.isFlask &&
            Boolean(state.installedSnap) &&
            !shouldDisplayReconnectButton(state.installedSnap)
          }
        />

        {txInfo && (
          <Card
            content={{
              title: 'Transaction Info',
              description: JSON.stringify(txInfo, null, 2),
            }}
            fullWidth={
              state.isFlask &&
              Boolean(state.installedSnap) &&
              !shouldDisplayReconnectButton(state.installedSnap)
            }
          />
        )}
        <Notice>
          <p>
            Please note that this is a prototype and may be <b>unsafe</b>.
            Consider using a new MetaMask profile for testing.
          </p>
        </Notice>
      </CardContainer>
    </Container>
  );
};
export default Index;
