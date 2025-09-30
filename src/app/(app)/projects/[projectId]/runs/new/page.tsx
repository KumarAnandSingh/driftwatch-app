export default function NewRun(){
  return (
    <section>
      <h1>Run DriftWatch</h1>
      <form>
        <label>Seed URL <input type="url" placeholder="https://example.com"/></label><br/>
        <label>Depth <input type="number" defaultValue={2}/></label><br/>
        <label>Rate limit <input type="number" defaultValue={2}/></label><br/>
        <button formAction="/api/runs/start" formMethod="post">Start Run</button>
      </form>
    </section>
  );
}
