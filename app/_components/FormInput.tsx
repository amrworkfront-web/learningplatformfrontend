import { FieldError } from "react-hook-form"

type FormInputProps = {
  label: string
  type?: string
  placeholder?: string
  register: any
  error?: FieldError
}

export default function FormInput({
  label,
  type = "text",
  placeholder,
  register,
  error,
}: FormInputProps) {
  return (
    <div>
      <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
        {label}
      </label>

      <input
        type={type}
        {...register}
        placeholder={placeholder}
        className="
          bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg
          focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5
          dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400
          dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500
        "
      />

      {error?.message && (
        <p className="text-red-500 text-sm mt-1">
          {error.message}
        </p>
      )}
    </div>
  )
}
