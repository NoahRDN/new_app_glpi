import { useMemo, useState } from "react";

const numbers = [1, 2, 3, 4, 5];

export function MemoTest() {
  const [search, setSearch] = useState("");
  const [counter, setCounter] = useState(0);

  const filteredNumbers = useMemo(() => {
    console.log("Calcul du filtre");

    return numbers.filter((number) => {
      return number.toString().includes(search);
    });
  }, [search]);

  return (
    <div>
      <input
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        placeholder="Recherche"
      />

      <button onClick={() => setCounter((value) => value + 1)}>
        Counter : {counter}
      </button>

      <pre>{JSON.stringify(filteredNumbers)}</pre>
    </div>
  );
}