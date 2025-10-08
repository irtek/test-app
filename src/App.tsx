import React, {useEffect, useState} from "react";
import MetricsConfigurator from "./components/MetricsConfigurator";
import {default as items} from "./data"

import {ReactComponent as LoaderIcon} from './assets/icons/loader.svg';

function App() {

    const [loading, setLoading] = useState(true);
    const [isFadingOut, setIsFadingOut] = useState(false);

    // Имитируем загрузку
    useEffect(() => {

        const fetchData = async () => {
            setLoading(true); // Установить состояние загрузки в true
            await new Promise((resolve) => setTimeout(resolve, 3500));
            setIsFadingOut(true);
            setTimeout(() => setLoading(false), 400);
        };

        fetchData();
    }, []);

    return (
        <>
            {loading && (
                <div className={`loaderWrapper ${isFadingOut && "loaderWrapperFadeOut"}`}><LoaderIcon/></div>
            )}

            {!loading && (
                <MetricsConfigurator items={items} loading={loading}/>
            )}
        </>
    );
}

export default App;