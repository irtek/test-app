import React from "react";
import styles from './Checkbox.module.scss';

interface CheckboxProps {
    value: number;
    label: string;
    isChecked: boolean;
    onChange: (value: number) => void;
}

const Checkbox: React.FC<CheckboxProps> = React.memo(({label, isChecked, onChange, value}) => {
    return (
        <div className={styles.Checkbox}>
            <label>
                <input type="checkbox" className={styles.Checkbox__input} checked={isChecked}
                       onChange={() => onChange(value)}/>
                {label}
            </label>
        </div>
    );
});

export default Checkbox;