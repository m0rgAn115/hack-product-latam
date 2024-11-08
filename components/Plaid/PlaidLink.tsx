import React, { useRef } from 'react';
import { WebView } from 'react-native-webview';
import queryString from 'query-string';
import { LinkErrorCode, LinkErrorType, LinkExitMetadataStatus } from './const';
import Constants from 'expo-constants';

export default function PlaidLink({ linkToken, onEvent, onExit, onSuccess }) {
  const webviewRef = useRef(null);

  const handleNavigationStateChange = (event) => {
    
    if (event.url.startsWith('plaidlink://')) {
      const eventParams = queryString.parse(event.url.replace(/.*\?/, ''));

      const {
        link_session_id: linkSessionId,
        mfa_type: mfaType,
        request_id: requestId,
        view_name: viewName,
        error_code: errorCode,
        error_message: errorMessage,
        error_type: errorType,
        exit_status: exitStatus,
        institution_id: institutionId,
        institution_name: institutionName,
        institution_search_query: institutionSearchQuery,
        timestamp,
        event_name: eventName,
        public_token: publicToken,
        accounts: accountsRaw,
      } = eventParams;

      if (!linkToken) {
        console.warn('No link token provided.');
      }

      if (event.url.startsWith('plaidlink://event') && onEvent) {
        onEvent({
          eventName,
          metadata: {
            linkSessionId,
            mfaType,
            requestId,
            viewName,
            errorCode,
            errorMessage,
            errorType,
            exitStatus,
            institutionId,
            institutionName,
            institutionSearchQuery,
            timestamp,
          },
        });
      } else if (event.url.startsWith('plaidlink://exit') && onExit) {
        onExit({
          error: {
            errorCode: LinkErrorCode?.[errorCode] || errorCode,
            errorMessage,
            errorType: LinkErrorType?.[errorType] || errorType,
          },
          metadata: {
            status: LinkExitMetadataStatus?.[exitStatus] || exitStatus,
            institution: {
              id: institutionId,
              name: institutionName,
            },
            linkSessionId,
            requestId,
          },
        });
      } else if (event.url.startsWith('plaidlink://connected') && onSuccess) {
        try {
          const accounts = JSON.parse(accountsRaw);
          onSuccess({
            publicToken,
            metadata: {
              institution: {
                id: institutionId,
                name: institutionName,
              },
              accounts,
              linkSessionId,
            },
          });
        } catch (error) {
          console.error('Error parsing accounts:', error);
        }
      }
      return false;
    }
    return true;
  };

  return (
    <WebView
      source={{
        uri: `https://cdn.plaid.com/link/v2/stable/link.html?isWebview=true&token=${linkToken}`,
      }}
      style={{
        flex: 1,
        marginTop: Constants.statusBarHeight,
      }}
      ref={webviewRef}
      onError={() => webviewRef.current?.reload()}
      originWhitelist={['https://*', 'plaidlink://*']}
      onShouldStartLoadWithRequest={handleNavigationStateChange}
    />
  );
}
