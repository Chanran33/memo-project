import React, { PureComponent } from "react";
import "./Modal.scss";

class ReModal extends PureComponent {
  // 이것은 state 를 정의 및 초기화 하는 코드이다. 컴포넌트가 만들어질때 한번만 호출
  // 모달창이 두번째 열릴때는 이미 컴포넌트가 만들어졌기 때문에 이 코드는 불리지 않는다.
  state = {
    title: "",
    content: "",
    author: "",
    thisID: 0,
  };

  // props가 변경될때 호출되는 오버라이딩 함수
  // componentWillReceiveProps(nextProps) {
  //   // state를 변경하는 방법은 setState 밖에 없다.
  //   this.setState({
  //     title: nextProps.data.title,
  //     content: nextProps.data.content,
  //     author: nextProps.data.author,
  //   });
  // }

  componentWillReceiveProps(nextProps) {
    const id = nextProps.data.index + 1;
    this.setState({
      thisID: id,
    });

    fetch(`/memo/${id}`, {
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
      .then((memo) => {
        this.setState({
          title: memo.title,
          content: memo.content,
          author: memo.author,
        });
        console.log("Network success - memo : ", memo);
      })
      .catch((error) => console.log("Network Error : ", error));
  }

  handleUpdate = (event) => {
    event.preventDefault();
    // this.props.onUpdate(this.props.data.index, this.state);
    // this.setState({
    //   title: "",
    //   content: "",
    //   author: "",
    // });
    // this.props.reclose();
    const id = this.state.thisID;

    fetch(`/memo/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
        Accept: "application/json",
      },
      mode: "cors",
      body: JSON.stringify({
        // fetch 특징
        title: this.state.title,
        content: this.state.content,
        author: this.state.author,
      }),
    })
      .then((response) => {
        this.props.reclose();
        return response.json();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  handleChange = (event) => {
    const {
      target: { name, value },
    } = event; //비구조화 할당
    this.setState({ [name]: value });
  };

  handleRemove = () => {
    console.log(this.props.data.index);
    const id = this.state.thisID;

    fetch(`/memo/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
        Accept: "application/json",
      },
      mode: "cors",
      body: JSON.stringify({
        // fetch 특징
        title: this.state.title,
        content: this.state.content,
        author: this.state.author,
      }),
    })
      .then((response) => {
        this.props.reclose();
        return response.json();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  render() {
    //props : 부모 컴포넌트로부터 가져오는 상태 값
    const { reOpen, reclose } = this.props;
    console.log(this.props);

    return (
      <div>
        {reOpen && (
          //모달 창이 열려 있다면
          <React.Fragment>
            <div className="Modal-verlay" onClick={reclose} />
            <div className="Modal">
              <h1 className="title">메모를 수정하세요!</h1>
              <form onSubmit={this.handleUpdate}>
                <div className="content">
                  <h4>
                    <input
                      type="text"
                      placeholder="아이디를 입력하세요"
                      name="author"
                      value={this.state.author}
                      onChange={this.handleChange}
                    ></input>
                  </h4>
                  <br />
                  <h4>
                    <input
                      type="text"
                      placeholder="제목을 입력하세요"
                      name="title"
                      value={this.state.title}
                      onChange={this.handleChange}
                    ></input>
                  </h4>
                  <textarea
                    name="content"
                    value={this.state.content}
                    onChange={this.handleChange}
                  ></textarea>
                </div>
                <div className="button-wrap">
                  <button type="submit">
                    <p>수정하기</p>
                  </button>
                  <button type="button" onClick={this.handleRemove}>
                    <p>삭제하기</p>
                  </button>
                </div>
              </form>
            </div>
          </React.Fragment>
        )}
      </div>
    );
  }
}

export default ReModal;
