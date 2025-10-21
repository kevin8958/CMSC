import {
  Combobox,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
  Description,
  Field,
  Label,
} from '@headlessui/react';
import { useState } from 'react';

const ComboBox = (props: Common.ComboBoxOption) => {
  const { options } = props;
  const [selectedOption, setSelectedOption] = useState(options[0]);
  const [query, setQuery] = useState('');

  const filteredOption =
    query === ''
      ? options
      : options.filter((opiton) => {
          return opiton.value.toLowerCase().includes(query.toLowerCase());
        });

  return (
    <Field>
      <Label>Assignee:</Label>
      <Description>This person will have full access to this project.</Description>

      <Combobox
        value={selectedOption}
        onChange={(option) =>
          setSelectedOption({
            id: option?.id || 0,
            value: option?.value || '',
          })
        }
        onClose={() => setQuery('')}
      >
        <ComboboxInput
          className="border-primary-700 focus:!border-primary-500 active:!border-primary-500 w-[200px] rounded-md border bg-transparent px-2 py-1 transition-all duration-100 ease-in-out outline-none focus:border-2"
          aria-label="Assignee"
          displayValue={(option) => {
            if (typeof option === 'string') return option;
            if (typeof option === 'object' && option !== null && 'name' in option) {
              return String((option as { value?: string }).value ?? '');
            }
            return '';
          }}
          onChange={(event) => setQuery(event.target.value)}
        />
        <ComboboxOptions
          anchor={{ to: 'bottom start', gap: '4px' }}
          className="bg-primary-700 w-[200px] rounded-md text-white empty:invisible"
        >
          {filteredOption.map((option) => (
            <ComboboxOption
              key={option.id}
              value={option}
              className="group hover:bg-primary-600 flex gap-2 px-2 py-1 data-focus:bg-blue-100"
            >
              {option.value}
            </ComboboxOption>
          ))}
        </ComboboxOptions>
      </Combobox>
    </Field>
  );
};

export default ComboBox;
