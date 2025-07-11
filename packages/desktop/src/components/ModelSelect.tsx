import { useMemo } from 'react'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { useConfigStore, useModelsStore } from '@/stores'

export function ModelSelect() {
  const [model, update] = useConfigStore((state) => [
    state.data.model,
    state.update
  ])
  const allModels = useModelsStore((state) => state.models)
  const downloadedModels = useMemo(
    () => allModels.filter((model) => model.status === 5),
    [allModels]
  )
  return (
    <Select
      value={model}
      onValueChange={(value) => {
        update({ model: value }).catch(() => {})
      }}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select a model" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {downloadedModels.map((model) => (
            <SelectItem key={model.name} value={model.name}>
              {model.title}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}

export default ModelSelect
