interface CustomInputProps {
    type: string;
    sx?: {};
    value?: any;
    defaultValue?: any;
    onChange?: React.ChangeEventHandler<HTMLInputElement>;
    disabled?: boolean;
    className?: string;
    placeholder?: string;
    addOnStart?: React.ReactNode;
    addOnEnd?: React.ReactNode;
    label?: string;
    error?: boolean;
    required?: boolean;
    autocomplete?: string;
    name?: string;
}

const CustomInput: React.FC<CustomInputProps> = ({
    defaultValue,
    name,
    type, autocomplete, required, className, value, error, onChange, label, addOnStart, addOnEnd, sx, placeholder, disabled }) => {
    let color = disabled ? 'border-[#757A6F] blur-[2px]' : error == true ? 'border-[#ff0000]' : error == false ? 'border-black ' : 'border-black';
    let labelDisable = disabled ? "blur-[2px]" : "";
    return (
        <div style={sx} className={className}>
            {label && <label htmlFor={name} className={`${labelDisable} font-normal `}>
                {label}
            </label>}
            <div className={`flex flex-row items-center justify-between border mt-3 ${color} p-2 rounded-lg w-full`}>
                {addOnStart && addOnStart}

                <input
                    className="p-2 w-full border rounded-xl focus:outline-none text-[14px] bg-transparent "
                    type={type}
                    name={name}
                    value={value}
                    defaultValue={defaultValue}
                    onChange={onChange}
                    disabled={disabled}
                    required={required}
                    placeholder={placeholder}
                    autoComplete={autocomplete}

                />
                {addOnEnd && addOnEnd}


            </div>
        </div>

    );
}



export default CustomInput;
