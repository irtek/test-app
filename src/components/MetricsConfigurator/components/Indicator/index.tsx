import React from "react";
import styles from './Indicator.module.scss';

import {ReactComponent as RemoveIconSVG} from '../../../../assets/icons/remove.svg';

const RemoveIcon = React.memo(RemoveIconSVG);

interface IndicatorProps {
    value: number;
    label: string;
    onRemove: () => void;
}

/**
 * Индикатор справа с кнопкой удаления
 *
 * @param value
 * @param label
 * @param onRemove
 * @constructor
 */
const Indicator: React.FC<IndicatorProps> = React.memo(({value, label, onRemove}) => {
    return (
        <div className={styles.Indicator}>
            <span className={styles.Indicator__label}>{label}</span>
            <button onClick={onRemove} className={`${styles.Indicator__btn} ${styles.Indicator__btnRemove}`}>
                <RemoveIcon/>
            </button>
        </div>
    );
});

export default Indicator;