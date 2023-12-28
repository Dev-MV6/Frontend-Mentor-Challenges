import { useState, useRef } from "react";
import IpAddressInfo from "./IpAddressInfo";
import Map from "./Map";

function App() {
  const infoContainerRef = useRef();
  const [location, setLocation] = useState();

  return (
    <div className="font-['Rubik'] text-very-dark-gray min-h-screen flex flex-col">
      <div className="bg-[url('/pattern-bg-mobile.png')] md:bg-[url('/pattern-bg-desktop.png')] h-[300px] lg:h-[280px] bg-no-repeat bg-center bg-cover px-[24px] py-[23px] lg:p-[24px]">
        <div className="max-w-[555px] lg:max-w-[1110px] relative mx-auto max-lg:text-center">
          <h1 className="text-[1.6rem] lg:text-[2rem] text-white font-medium text-center">IP Address Tracker</h1>
          <IpAddressInfo location={location} setLocation={setLocation} ref={infoContainerRef} />
        </div>
      </div>

      <Map location={location} infoContainerRef={infoContainerRef} />
    </div>
  );
}

export default App;
