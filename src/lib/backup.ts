export function downloadJSON(filename: string, data: unknown) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}

export async function pickJSON<T = unknown>(): Promise<T | null> {
  return new Promise((resolve) => {
    const inp = document.createElement("input");
    inp.type = "file";
    inp.accept = "application/json";
    inp.onchange = () => {
      const f = (inp.files && inp.files[0]) || null;
      if (!f) return resolve(null);
      const reader = new FileReader();
      reader.onload = () => {
        try { resolve(JSON.parse(String(reader.result)) as T); }
        catch { resolve(null); }
      };
      reader.readAsText(f);
    };
    inp.click();
  });
}
