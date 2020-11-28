import React, { useEffect } from 'react';
import propTypes from 'prop-types';
import Deck from './deck';
import useBroadcastChannel from '../../hooks/use-broadcast-channel';

/**
 * Spectacle DefaultDeck is a wrapper around the Deck component that adds Broadcast channel support
 * for audience and presenter modes. This is intentionally not built into the base Deck component
 * to allow for extensibility outside of core Spectacle functionality.
 */
export default function DefaultDeck({
  overviewMode = false,
  printMode = false,
  ...props
}) {
  const deck = React.useRef();

  const [postMessage] = useBroadcastChannel(
    'spectacle_presenter_bus',
    message => {
      if (message.type !== 'SYNC') return;
      const nextView = message.payload;
      if (deck.current.initialized) {
        deck.current.skipTo(nextView);
      } else {
        deck.current.initializeTo(nextView);
      }
    }
  );

  useEffect(() => {
    postMessage('SYNC_REQUEST');
  }, [postMessage]);

  return (
    <Deck
      overviewMode={overviewMode}
      printMode={printMode}
      ref={deck}
      {...props}
    />
  );
}

DefaultDeck.propTypes = {
  ...Deck.propTypes,
  overviewMode: propTypes.bool,
  printMode: propTypes.bool
};
