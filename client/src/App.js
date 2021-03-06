import React from "react";
import "./App.css";
import plus from "./plus.png";
import Modal from "./components/Modal";
import ReModal from "./components/ReModal";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isModalOpen: false,
      reModalOpen: false,
      memos: [],
      memoID: 0,
      clickmemo: {
        memoID: 0,
        title: "",
        author: "",
        content: "",
      },
    };
  }

  //서버와 연결시켜서 데이터를 받게 해보자!
  componentWillMount() {
    fetch("/memo", {
      method: "GET",
      headers: {
        "Content-Type": "application/json:charset=UTF-8",
        Accept: "application/json",
      },
      mode: "cors",
    })
      .then((res) => {
        return res.json();
      })
      .then((memos) => {
        this.setState({ memos: memos });
        //memoID증가시켜줘야해서 데이터 받아올때 현재 개수 셈
        this.setState({ memoID: this.state.memos.length });
        console.log("Network success - memo : ", memos);
      })
      .catch((error) => console.log("Network Error : ", error));
  }

  openModal = () => {
    this.setState({ isModalOpen: true });
  };

  closeModal = () => {
    this.setState({ isModalOpen: false });
  };

  //수정할 메모는 모달창을 열 때 입력되어있는 state대로 올라갈 수 있도록 한다.
  reopenModal = (index) => {
    //reModal창을 열어주자
    this.setState({
      reModalOpen: true,
      clickmemo: {
        index: index,
        title: this.state.memos[index].title,
        author: this.state.memos[index].author,
        content: this.state.memos[index].content,
      },
    });
  };

  recloseModal = () => {
    this.setState({ reModalOpen: false });
    window.location.reload();
  };

  handleCreate = (new_memo) => {
    console.log(new_memo);
    let memos = this.state.memos;
    this.setState({ memos: [...memos, new_memo] });
  };

  handleUpdate = (id, change_memo) => {
    console.log(id);
    console.log(change_memo);
    let memos = this.state.memos;
    this.setState({
      memos: memos.map((memos, index) => {
        if (index === id) {
          console.log(index + "/" + id);
          return { id, ...change_memo };
        }
        return memos;
      }),
    });
  };

  handleRemove = (id) => {
    let memos = this.state.memos;
    this.setState({
      memos: memos.filter((memo, index) => index !== id),
    });
  };

  render() {
    return (
      <div className="container">
        <div className="App">
          <h1>메모장</h1>
          <br />
          <br />
          <table>
            <tbody>
              <tr className="trList">
                {this.state.memos.map((memo, index) => (
                  <td
                    className="cell"
                    key={index}
                    onClick={() => this.reopenModal(index)}
                  >
                    <div className="inner">
                      <h2>{memo.title}</h2>
                      <h5>{memo.author}</h5>
                      <br />
                      <br />
                      <h4>{memo.content}</h4>
                      <br />
                    </div>
                  </td>
                ))}
                <td className="cell">
                  <div className="inner" onClick={this.openModal}>
                    <img src={plus} className="picture" alt="logo" />
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
          <main className="App">
            <Modal
              isOpen={this.state.isModalOpen}
              close={this.closeModal}
              onCreate={this.handleCreate}
              memoID={this.state.memoID}
            />
            <ReModal
              reOpen={this.state.reModalOpen}
              reclose={this.recloseModal}
              data={{ ...this.state.clickmemo }} //딥카피
              onUpdate={this.handleUpdate}
              onRemove={this.handleRemove}
              memoID={this.state.memoID}
            />
          </main>
        </div>
      </div>
    );
  }
}

export default App;
