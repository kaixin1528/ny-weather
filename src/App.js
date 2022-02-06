import { useState, useEffect } from "react";
import Info from "./components/Info";
import {
  AnimatedAxis,
  AnimatedGrid,
  AnimatedLineSeries,
  XYChart,
  Tooltip,
  darkTheme,
} from "@visx/xychart";

import { ParentSize } from "@visx/responsive";
import { motion, AnimatePresence } from "framer-motion";
import { faArrowRight, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function App() {
  const [openMoreInfo, setOpenMoreInfo] = useState(false);
  const [showForecast, setShowForecast] = useState(false);
  const [currentWeather, setCurrentWeather] = useState([]);
  const [forecast, setForecast] = useState([]);

  const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=new%20york&units=metric&appid=${process.env.REACT_APP_API_KEY}`;
  const forecastUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=40.71&lon=-74&units=metric&exclude=minutely,hourly&appid=${process.env.REACT_APP_API_KEY}`;

  const days = {
    0: "Sunday",
    1: "Monday",
    2: "Tuesday",
    3: "Wednesday",
    4: "Thursday",
    5: "Friday",
    6: "Saturday",
  };

  useEffect(() => {
    fetch(weatherUrl)
      .then((res) => res.json())
      .then((data) => setCurrentWeather(data));

    fetch(forecastUrl)
      .then((res) => res.json())
      .then((data) => setForecast(data));
  }, [weatherUrl, forecastUrl]);

  const high =
    forecast &&
    forecast.daily &&
    forecast.daily.slice(0, 7).map((day) => {
      const date = `${String(new Date(day.dt * 1000).getMonth()).padStart(
        2,
        "0"
      )}/${String(new Date(day.dt * 1000).getDate()).padStart(2, "0")}`;
      return {
        x: date,
        y: Math.round(day.temp.max),
        high: Math.round(day.temp.max),
        low: Math.round(day.temp.min),
        day: days[new Date(day.dt * 1000).getDay()],
        weather: day.weather[0].description,
      };
    });

  const low =
    forecast &&
    forecast.daily &&
    forecast.daily.slice(0, 7).map((day) => {
      const date = `${String(new Date(day.dt * 1000).getMonth()).padStart(
        2,
        "0"
      )}/${String(new Date(day.dt * 1000).getDate()).padStart(2, "0")}`;
      return {
        x: date,
        y: Math.round(day.temp.min),
        high: Math.round(day.temp.max),
        low: Math.round(day.temp.min),
        day: days[new Date(day.dt * 1000).getDay()],
        weather: day.weather[0].description,
      };
    });

  const accessors = {
    xAccessor: (d) => d.x,
    yAccessor: (d) => d.y,
    highAccessor: (d) => d.high,
    lowAccessor: (d) => d.low,
    dayAccessor: (d) => d.day,
    weatherAccessor: (d) => d.weather,
  };

  return (
    <main className='grid font-overpass text-white'>
      <AnimatePresence initial={false}>
        {!showForecast && currentWeather && (
          <motion.section
            initial={{ x: -300 }}
            animate={{ x: 0, transition: { duration: 0.3 } }}
            className='lg:grid lg:grid-cols-2 min-h-screen px-10 md:px-20 lg:px-32 xl:px-60 pt-[30rem] md:pt-[31rem] lg:pt-[34rem] bg-no-repeat bg-cover bg-main'
          >
            <button
              className='absolute right-8 top-[25rem] text-4xl md:text-5xl stroke-cyan-500 animate-bounce'
              onClick={() => {
                setShowForecast(!showForecast);
                setOpenMoreInfo(false);
              }}
            >
              <FontAwesomeIcon icon={faArrowRight} />
            </button>
            {currentWeather && currentWeather.main && (
              <article>
                <article className='flex font-extralight lg:text-lg divide-x-2'>
                  <h2 className='flex pr-2'>
                    {Math.round(currentWeather.main.temp_min)}{" "}
                    <span className='text-xs'>°</span>
                  </h2>
                  <h2 className='flex pl-2'>
                    {Math.round(currentWeather.main.temp_max)}{" "}
                    <span className='text-xs'>°</span>
                  </h2>
                </article>
                <h1 className='flex text-8xl lg:text-9xl font-bold'>
                  {Math.round(currentWeather.main.temp)}{" "}
                  <span className='text-xl'>°C</span>
                </h1>
                <p className='text-xl font-semibold'>
                  NOW IN {currentWeather.name.toUpperCase()}, USA
                </p>
              </article>
            )}
            <button
              className='text-xs lg:text-sm mt-12 lg:my-28 py-3 px-5 mx-auto hover:bg-gray-300 bg-white text-black text-opacity-60 rounded-full'
              onClick={() => {
                setOpenMoreInfo(!openMoreInfo);
                if (openMoreInfo) {
                  window.scrollTo({
                    left: 0,
                    top: 0,
                    behavior: "smooth",
                  });
                } else
                  window.scrollTo({
                    left: 0,
                    top: window.innerHeight,
                    behavior: "smooth",
                  });
              }}
            >
              SHOW {openMoreInfo ? "LESS" : "MORE"}
            </button>
          </motion.section>
        )}
      </AnimatePresence>
      {currentWeather && currentWeather.wind && (
        <section
          className={`grid md:grid-cols-2 text-base text-black p-10 md:px-20 lg:px-32 xl:px-60 gap-5 ${
            showForecast && "hidden"
          }`}
        >
          <Info
            title='WIND SPEED'
            value={Math.round(currentWeather.wind.speed)}
            unit='m/s'
          />
          <Info
            title='HUMIDITY'
            value={Math.round(currentWeather.main.humidity)}
            unit='%'
          />
          <Info
            title='PRESSURE'
            value={Math.round(currentWeather.main.pressure)}
            unit='hPa'
          />
          <article className='grid grid-cols-2 md:grid-cols-1'>
            <h3 className='text-xs md:text-sm text-black text-opacity-50'>
              SUNRISE / SUNSET
            </h3>
            {
              <p className='md:text-2xl lg:text-4xl xl:text-5xl font-semibold justify-self-end md:justify-self-start'>
                {new Date(currentWeather.sys.sunrise * 1000).getHours()}:
                {String(
                  new Date(currentWeather.sys.sunrise * 1000).getMinutes()
                ).padStart(2, "0")}{" "}
                <span className='text-xs md:text-base lg:text-2xl xl:text-3xl'>
                  am
                </span>{" "}
                / {new Date(currentWeather.sys.sunset * 1000).getHours()}:
                {String(
                  new Date(currentWeather.sys.sunset * 1000).getMinutes()
                ).padStart(2, "0")}{" "}
                <span className='text-xs md:text-base lg:text-2xl xl:text-3xl'>
                  pm
                </span>
              </p>
            }
          </article>
        </section>
      )}
      <AnimatePresence initial={false}>
        {showForecast && (
          <motion.section
            initial={{ x: 300 }}
            animate={{ x: 0, transition: { duration: 0.3 } }}
            className='min-h-screen pt-10 bg-black bg-opacity-80'
          >
            <button
              className='absolute left-5 top-[25rem] text-4xl md:text-5xl text-white animate-bounce'
              onClick={() => setShowForecast(!showForecast)}
            >
              <FontAwesomeIcon icon={faArrowLeft} />
            </button>
            <h1 className='text-2xl lg:text-3xl text-center font-bold'>
              7-Day Forecast
            </h1>
            <section className='w-screen h-[42rem] px-5 md:px-10'>
              <ParentSize>
                {({ width, height }) => (
                  <XYChart
                    width={width}
                    height={height}
                    theme={darkTheme}
                    xScale={{ type: "band" }}
                    yScale={{ type: "linear", domain: [-20, 20] }}
                  >
                    <AnimatedAxis orientation='bottom' />
                    <AnimatedAxis
                      orientation='right'
                      label='Temperature (°C)'
                    />
                    <AnimatedGrid columns={false} numTicks={4} />
                    <AnimatedLineSeries
                      dataKey='Highest Temperature'
                      data={high}
                      {...accessors}
                    />
                    <AnimatedLineSeries
                      dataKey='Lowest Temperature'
                      data={low}
                      {...accessors}
                    />
                    <Tooltip
                      snapTooltipToDatumX
                      snapTooltipToDatumY
                      showVerticalCrosshair
                      showSeriesGlyphs
                      renderTooltip={({ tooltipData }) => (
                        <section className='grid gap-1'>
                          <article className='flex gap-1 pb-3'>
                            <h4>
                              {accessors.dayAccessor(
                                tooltipData.nearestDatum.datum
                              )}
                            </h4>
                          </article>
                          <article className='flex gap-1'>
                            <h4 className='text-high'>High Temp:</h4>
                            <p>
                              {accessors.highAccessor(
                                tooltipData.nearestDatum.datum
                              )}{" "}
                              <span className=''>°C</span>
                            </p>
                          </article>
                          <article className='flex gap-1'>
                            <h4 className='text-low'>Low Temp:</h4>
                            <p>
                              {accessors.lowAccessor(
                                tooltipData.nearestDatum.datum
                              )}{" "}
                              °C
                            </p>
                          </article>
                          <article className='flex gap-1'>
                            <h4 className='text-blue-200'>Weather:</h4>
                            <p className='capitalize'>
                              {accessors.weatherAccessor(
                                tooltipData.nearestDatum.datum
                              )}
                            </p>
                          </article>
                        </section>
                      )}
                    />
                  </XYChart>
                )}
              </ParentSize>
            </section>
          </motion.section>
        )}
      </AnimatePresence>
    </main>
  );
}

export default App;
