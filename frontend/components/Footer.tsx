import Link from "next/link";
import { useAccount } from "wagmi";

const Footer = () => {
  const { address } = useAccount();

  return (
    <footer className="footer mt-10 p-10 bg-base-200 text-base-content flex flex-wrap items-center justify-around">
      <div className="flex flex-col items-center">
        <img src="/logod3.jpg" alt="Disrup3" width={60} />
        <p className="text-center">Disrup3<br/>The best web3 bootcamp</p>
      </div>
      <div className="flex flex-col items-center">
        <span className="footer-title">Marketplace</span>
        <Link href="/">Homepage</Link>
        <Link href="/explore">Explore</Link>
        {
          address && <Link href={`/user/${address}`}>User</Link>
        }
      </div>
      <div className="flex flex-col items-center">
        <span className="footer-title">Company</span>
        <p className="link link-hover">Bootcamp web3</p>
        <p className="link link-hover">Bootcamp Fullstack</p>
      </div>
      <div className="flex flex-col items-center">
        <span className="footer-title">Legal</span>
        <p className="link link-hover">Terms of use</p>
        <p className="link link-hover">Privacy</p>
      </div>
    </footer>
  );
};

export default Footer;