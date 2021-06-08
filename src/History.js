import './History.css';

export default function History(props) {
  return (
    <ul className="ulContainer">
      <p className="title">History</p>
      {props.resultHist.map((list, index) => (
        <li key={index}>
          <p>{list.input}</p>
          <p>{list.result}</p>
        </li>
      ))}
    </ul>
  );
}
