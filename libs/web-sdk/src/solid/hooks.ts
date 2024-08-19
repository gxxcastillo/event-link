import { useContext } from 'solid-js';
import { EventLinkContext } from './context';

export function useEventLink() {
  return useContext(EventLinkContext);
}
