import { ConnectButton } from '../buttons/ConnectButton/ConnectButton';
import styles from './SiteHeader.module.css';

export function SiteHeader() {
  return (
    <header class={styles.SiteHeader}>
      <h1 class="title">EventLink</h1>
      <ConnectButton />
    </header>
  );
}
