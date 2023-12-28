import { forwardRef, useRef, useState, useEffect } from "react";

const IpAddressInfo = forwardRef(function IpAddressInfo({ location, setLocation }, ref) {
  const inputBoxRef = useRef();
  const errorMsgRef = useRef();
  const [addressOrDomain, setAddressOrDomain] = useState("0.0.0.0");
  const [timeOffset, setTimeOffset] = useState("0:00");
  const [isp, setIsp] = useState("SpaceX Starlink");

  function isValidAddress(x) {
    if (!x || !/^(\b25[0-5]|\b2[0-4][0-9]|\b[01]?[0-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/.test(x)) {
      return false;
    }
    return true;
  }

  function isValidDomain(x) {
    if (!x || !/^([a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,}$/.test(x)) {
      return false;
    }
    return true;
  }

  const ipifyUrl = "https://geo.ipify.org/api/v2/country,city?apiKey=at_QxD8K29OnFLfwlupJRkR4QISU35Gk";

  function showErrorMessage(msg) {
    console.error(msg);
    if (errorMsgRef.current) {
      errorMsgRef.current.classList.replace("hidden", "flex");
      errorMsgRef.current.innerText = msg;
    }
  }

  function getIpAdressInfo(inputValue) {
    let query;
    if (inputValue || inputValue == "") {
      if (isValidAddress(inputValue)) {
        query = "ipAddress=" + inputValue;
      } else if (isValidDomain(inputValue)) {
        query = "domain=" + inputValue;
      } else {
        showErrorMessage("Please enter a valid IP address or domain");
        return;
      }
    }

    errorMsgRef.current?.classList.replace("flex", "hidden");

    const res = fetch(`${ipifyUrl}&${query}`, { method: "GET", cache: "force-cache" });
    res
      .then((res) => {
        if (res.ok) {
          res.json().then((json) => {
            setAddressOrDomain(json.ip);
            setLocation(json.location);
            setTimeOffset(json.location.timezone);
            setIsp(json.isp);
          });
        } else {
          throw new Error();
        }
      })
      .catch(() => {
        showErrorMessage(`Unable to get information about this ${query == "ipAddress=" ? "IP address" : "domain"}`);
      });
  }

  useEffect(getIpAdressInfo, []);

  return (
    <>
      <form
        className="flex h-[58px] rounded-2xl mt-[24px] lg:mt-[22px] lg:max-w-[555px] lg:mx-auto bg-white relative"
        onSubmit={(e) => {
          e.preventDefault();
          getIpAdressInfo(inputBoxRef.current.value);
        }}
      >
        <input
          className="w-full px-[25px] rounded-l-2xl focus:outline-none text-[1.13rem] placeholder:text-dark-gray placeholder:opacity-1"
          placeholder="Search for any IP address or domain"
          type="text"
          autoCorrect="off"
          autoCapitalize="none"
          ref={inputBoxRef}
        />
        <button
          className="bg-black rounded-r-2xl min-w-[58px] flex items-center justify-center hover:opacity-80 cursor-pointer transition-opacity duration-300"
          type="submit"
	  aria-label="Search"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="11" height="14">
            <path fill="none" stroke="#FFF" strokeWidth="3" d="M2 1l6 6-6 6" />
          </svg>
        </button>
      </form>
      <span
        ref={errorMsgRef}
        className="text-white lg:max-w-[555px] lg:mx-auto bg-light-red/60 rounded-2xl p-[10px] items-center justify-center border-2 border-light-red mt-[5px] hidden font-medium text-[0.9rem]"
      >
        Please enter a valid IP address or domain
      </span>
      <div
        ref={ref}
        className="bg-white flex flex-col gap-[12px] lg:gap-[20px] absolute w-full py-[17px] px-[25px] rounded-2xl mt-[24px] lg:mt-[48px] shadow-lg text-[1.23rem] lg:text-[1.59rem] lg:grid-cols-[repeat(3,_minmax(0,1fr)_1px)_minmax(0,1fr)] lg:grid lg:py-[30px] leading-[1.4em] lg:leading-[1.86rem] lg:min-h-[161px] max-lg:pb-[20px] z-[1000]"
      >
        <div className="lg:px-[8px]">
          <span className="block text-dark-gray font-bold text-[0.5em] uppercase tracking-[0.15em] lg:tracking-[0.1em]">
            IP address
          </span>
          <span className="block font-medium lg:mt-[5px]">{addressOrDomain}</span>
        </div>
        <div className="lg:inline-block hidden h-[75%] bg-dark-gray/40 self-center"></div>
        <div className="lg:px-[10px]">
          <span className="block text-dark-gray font-bold text-[0.5em] uppercase tracking-[0.15em] lg:tracking-[0.1em]">
            Location
          </span>
          <span className="block font-medium lg:mt-[5px] text-ellipsis overflow-hidden">
            {(!!location && `${location.city && location.city + ", "}${location.region} ${location.postalCode}`.trimEnd()) ||
              "Planet Earth"}
          </span>
        </div>
        <div className="lg:inline-block hidden h-[75%] bg-dark-gray/40 self-center"></div>
        <div className="lg:px-[13px]">
          <span className="block text-dark-gray font-bold text-[0.5em] uppercase tracking-[0.15em] lg:tracking-[0.1em]">
            Timezone
          </span>
          <span className="block font-medium lg:mt-[5px]">{(!!timeOffset && "UTC " + timeOffset) || "Unknown"}</span>
        </div>
        <div className="lg:inline-block hidden h-[75%] bg-dark-gray/40 self-center"></div>
        <div className="lg:px-[15px] lg:pr-[30px]">
          <span className="block text-dark-gray font-bold text-[0.5em] uppercase tracking-[0.1em]">isp</span>
          <span className="block font-medium lg:mt-[5px] text-ellipsis overflow-hidden">{isp || "Unknown"}</span>
        </div>
      </div>
    </>
  );
});

export default IpAddressInfo;
