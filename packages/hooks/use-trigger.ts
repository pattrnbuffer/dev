export function useTrigger(effect, deps = []) {
  const [fire, setFire] = useState(0)
  useEffect(effect, [fire, ...deps])
  return useCallback(() => setFire((pulls) => pulls + 1), [])  
}
