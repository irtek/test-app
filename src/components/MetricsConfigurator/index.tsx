import React, {useCallback, useEffect, useMemo, useState} from "react";
import Checkbox from "./components/Checkbox";
import Indicator from "./components/Indicator";
import {GroupedCheckboxItems} from "../../data";
import styles from "./MetricsConfigurator.module.scss";

import {ReactComponent as SearchIcon} from '../../assets/icons/search.svg';
import {ReactComponent as RemoveAllIcon} from '../../assets/icons/removeAll.svg';

interface MetricsConfiguratorProps {
    items: GroupedCheckboxItems[];
    loading?: boolean;
}

const MetricsConfigurator: React.FC<MetricsConfiguratorProps> = React.memo(({items, loading}) => {

    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (!loading) {
            setTimeout(() => setVisible(true), 400);
        }
    }, [loading]);

    // Поиск
    const [searchTerm, setSearchTerm] = useState("");

    // Чекбоксы
    const [checkedState, setCheckedState] = useState(
        items.map((group: { items: any[]; }) => group.items.map(() => false))
    );

    // Состояния индикаторов
    const [indicators, setIndicators] = useState<{ groupIndex: number; itemIndex: number }[]>([]);

    const filteredItems = useMemo(() => {
        return items
            .map((group) => {

                const filteredGroupItems = group.items.filter((item) =>
                    item.label.toLowerCase().includes(searchTerm.toLowerCase())
                );

                // Если в группе остались элементы
                if (filteredGroupItems.length > 0) {
                    return {...group, items: filteredGroupItems};
                }

                return null;
            })
            .filter((group) => group !== null); // Убираем пустые группы
    }, [searchTerm, items]);

    // Обработчик чекбокса
    const handleCheckboxChange = useCallback((groupIndex: number, itemIndex: number) => {
        setCheckedState((prevCheckedState: any) => {
            const updatedState = [...prevCheckedState];
            updatedState[groupIndex] = [...updatedState[groupIndex]];
            updatedState[groupIndex][itemIndex] = !prevCheckedState[groupIndex][itemIndex];
            return updatedState;
        });

        setIndicators((prevIndicators) => {
            const isChecked = checkedState[groupIndex][itemIndex];
            if (!isChecked) {
                // Добавляем индикатор в конец списка
                return [...prevIndicators, {groupIndex, itemIndex}];
            } else {
                // Удаляем индикатор из списка
                return prevIndicators.filter(
                    (indicator) =>
                        indicator.groupIndex !== groupIndex || indicator.itemIndex !== itemIndex
                );
            }
        });
    }, [checkedState]);

    // Удаление индикатора
    const handleIndicatorRemove = useCallback((groupIndex: number, itemIndex: number) => {
        setCheckedState((prevCheckedState: any) => {
            const updatedState = [...prevCheckedState];
            updatedState[groupIndex] = [...updatedState[groupIndex]];
            updatedState[groupIndex][itemIndex] = false;
            return updatedState;
        });

        setIndicators((prevIndicators) =>
            prevIndicators.filter(
                (indicator) =>
                    indicator.groupIndex !== groupIndex || indicator.itemIndex !== itemIndex
            )
        );
    }, []);

    // Удаление всех индикаторов
    const handleRemoveAllIndicators = useCallback(() => {
        setCheckedState(items.map((group) => group.items.map(() => false)));
        setIndicators([]);
    }, [items]);

    const handleClearSearch = () => {
        setSearchTerm("")
    }

    const hasIndicators = indicators.length > 0;
    const hasSearchResults = filteredItems.length > 0;

    /**
     * Группа чекбоксов
     *
     */
    const Group = React.memo(({group, groupIndex, checkedState, handleCheckboxChange}: any) => {
        return (
            <div>
                <h3 className={styles.metricsConfigurator__groupTitle}>{group.group}</h3>
                <div className={styles.metricsConfigurator__list}>
                    {group.items.map((item: any, itemIndex: number) => (
                        <Checkbox
                            key={itemIndex}
                            label={item.label}
                            isChecked={checkedState[groupIndex][itemIndex]}
                            onChange={() => handleCheckboxChange(groupIndex, itemIndex)}
                            value={item.value}
                        />
                    ))}
                </div>
            </div>
        );
    });

    return (
        <section className={`${styles.metricsConfigurator} ${visible && styles.metricsConfiguratorLoaded}`}>
            <div className={styles.metricsConfigurator__inner}>

                <h2 className={styles.metricsConfigurator__title}>Настройка показателей</h2>

                <div className={styles.metricsConfigurator__row}>

                    <div className={styles.metricsConfigurator__column}>
                        <header className={styles.metricsConfigurator__columnHeader}>
                            <div className={styles.metricsConfiguratorSearch}>
                                <SearchIcon className={styles.metricsConfiguratorSearch__icon}/>
                                <input
                                    className={styles.metricsConfiguratorSearch__input}
                                    type="search"
                                    name="Поиск"
                                    placeholder="Поиск"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                {searchTerm && (
                                    <button className={styles.metricsConfiguratorSearch__clearBtn}
                                            onClick={handleClearSearch}>×</button>
                                )}
                            </div>
                        </header>

                        <div
                            className={`${styles.metricsConfigurator__scrollable} ${styles.metricsConfigurator__groupList}`}>
                            {!hasSearchResults && (
                                <div className={styles.metricsConfigurator__noSearchResults}>
                                    <div>( ´•︵•` )</div>
                                    <div>Ничего не найдено.</div>
                                    <span onClick={handleClearSearch}>Очистить результаты поиска?</span>
                                </div>
                            )}
                            {filteredItems.map((group, groupIndex) => (
                                <Group
                                    key={groupIndex}
                                    group={group}
                                    groupIndex={groupIndex}
                                    checkedState={checkedState}
                                    handleCheckboxChange={handleCheckboxChange}
                                />
                            ))}
                        </div>
                    </div>
                    <div
                        className={`${styles.metricsConfigurator__column} ${styles.metricsConfigurator__columnIndicators}`}>
                        <header className={styles.metricsConfigurator__columnHeader}>
                            <h3 className={styles.metricsConfigurator__columnTitle}>Добавленные показатели</h3>
                            {hasIndicators && (
                                <button
                                    className={styles.metricsConfigurator__removeAllIndicatorsBtn}
                                    onClick={handleRemoveAllIndicators}
                                >
                                    <RemoveAllIcon/> Удалить все
                                </button>
                            )}
                        </header>

                        <div
                            className={`${styles.metricsConfigurator__scrollable} ${styles.metricsConfigurator__list}`}>

                            {!hasIndicators && (
                                <div className={styles.metricsConfigurator__noSearchResults}>
                                    <div>( ´•︵•` )</div>
                                    <div>Ни один показатель не добавлен</div>
                                    <div>← выберите показатели слева</div>
                                </div>
                            )}

                            {indicators.map(({groupIndex, itemIndex}) => (
                                <Indicator
                                    key={`${groupIndex}-${itemIndex}`}
                                    label={items[groupIndex].items[itemIndex].label}
                                    onRemove={() => handleIndicatorRemove(groupIndex, itemIndex)}
                                    value={items[groupIndex].items[itemIndex].value}
                                />
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
})

export default MetricsConfigurator;