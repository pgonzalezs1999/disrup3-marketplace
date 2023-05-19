import { ConnectButton } from "@rainbow-me/rainbowkit";
import Link from "next/link";
import { useEffect, useState } from "react";
import { SiweMessage } from "siwe";
import { useLocalStorage } from "use-hooks";
import { useAccount, useNetwork, useSignMessage } from "wagmi";
import BackArrow from "./BackArrow";
import { useRouter } from "next/router";

const Navbar = () => {
  const [theme, setTheme] = useLocalStorage("theme", "dark");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const toggleTheme = () => {
    setTheme(theme === "synthwave" ? "cupcake" : "synthwave");
  };
  const { address } = useAccount();
  const { chain } = useNetwork();
  const { signMessageAsync } = useSignMessage();
  const router = useRouter();
  const [hasPreviousPage, setHasPreviousPage] = useState<boolean>(false);

  async function login() {
    try {
      const nonce = await (await fetch("/api/auth/getNonce")).json();
      console.log(nonce);
      // firmar mensaje para que el servidor verifique que el user es quien dice ser
      const message = new SiweMessage({
        domain: window.location.host,
        address,
        statement: "Login to the app",
        uri: window.location.origin,
        version: "1",
        chainId: chain?.id,
        nonce: nonce.nonce,
      });

      // decimos a metamask que el usuario firme el mensage
      const signature = await signMessageAsync({
        message: message.prepareMessage(),
      });
      const verifyRes = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message, signature }),
      });
      setIsLoggedIn(true);
    } catch(error) {
      setIsLoggedIn(false);
      console.log(error);
    }
  }

  useEffect(() => {
    const body = document.body;
    body.setAttribute("data-theme", theme);
  }, [theme]);

  useEffect(() => {
    const checkSession = async () => {
      const data = await (await fetch("/api/auth/me")).json();
      if (!data?.isLoggedIn) {
        setIsLoggedIn(false);
      } else {
        setIsLoggedIn(true);
      }
      setTimeout(() => {
        checkSession();
      }, 4000);
    };
    checkSession();
  }, []);

  useEffect(() => {
    setHasPreviousPage(router.pathname != "/" && router.pathname != "");
  }, [router, useRouter]);

  useEffect(() => {
    async function isUserDifferent() {
      try {
        const data = await (await fetch("/api/auth/me")).json();
        if(data.user?.address === address) {
          await (await fetch("/api/auth/logout")).json();
        }
      } catch (error) {
        console.log(error);
      }
    }
    isUserDifferent();
  }, [address]);

  return (
    <nav className="flex items-center justify-between py-5 px-8">
      <div className="flex items-center">
        {
          (hasPreviousPage)
          ?
            (theme === "synthwave")
            ? <BackArrow className="invert"/>
            : <BackArrow className=""/>
          : null
        }
        <Link href="/">
          <h1 className="text-2xl">Disrup3 Marketplace</h1>
        </Link>
      </div>
      <div className="flex items-center gap-5">
        <button
          onClick={toggleTheme}
          className={`
            w-12 h-6 rounded-full p-1 bg-secondary
            bg-opacity-30 relative transition-colors 
            duration-500 ease-in focus:outline-none 
            ring-2 ring-primary focus:border-transparent
          `}
        >
        <div
          id="toggle"
          className={`
            rounded-full w-4 h-4 bg-primary relative 
            ${theme === "cupcake" ? "ml-0" : "ml-6"}
            pointer-events-none transition-all 
            duration-300 ease-out
          `}
        ></div>
        </button>
        <ConnectButton
          chainStatus={{
            smallScreen: "none",
            largeScreen: "icon",
          }}
          accountStatus={{
            smallScreen: "address", 
          }}
        />
        {(address && !isLoggedIn) && (
          <p className="" onClick={login}>Sign in</p>
        )}
      </div>
    </nav>
  );
};

export default Navbar;