# 目錄
- [程式啟動方式](#程式啟動方式)
  - [Prerequisites](#prerequisites)
  - [Installing](#installing)
  - [Run Server](#run-server)
- [程式架構](#程式架構)
- [API document](#api-document)

- [研究心得](#研究心得) 

<br/>
<br/>

# 程式啟動方式

## **Prerequisites**
Make sure you already have installed `Node.js`, `npm`, `typescript` (in global).

## **Installing**
1. Clone the project and go to the project directory
    ```bash
    git clone https://github.com/Yunya-Hsu/wonderpet_GraphQL_server

    cd wonderpet_GraphQL_server
    ```

2. Install dependencies
    ```
    npm install
    ```

3. Prepare your `.env` file. Please refer to `.env.example` for more details. 


## **Run Server**

1. Start server
    ```
    npm run start
    ```

    If you see `🚀  Server ready at: http://localhost:4000/`  on terminal, it means the server is running successfully and you can test API from [GraphQL playground](http://localhost:4000/) on your browser.

2. Stop server
    ```
    control + c
    ```
<br/>
<br/>


# 程式架構
```
├── src
    ├── resolvers
        └── resolvers.ts
    ├── schema
        └── schema.graphql
    └── server.ts
├── .gitignore
├── 後端面試專案.md
├── package.json
├── README.md
└── user-data.json
    
```
重點說明：
* **src 資料夾**：開發項目資料夾
* **src/resolvers 資料夾 ＆ resolvers.ts**：GraphQL API 的實作，對應 Schema 資料格式來取得/ 操作/ 計算所需資料
* **src/schema 資料夾 ＆ schema.graphql**：定義回傳的資料格式
* **src/server.ts**：主程式
* **user-data.json**：使用者資料（模擬 database）
  
<br/>
<br/>


# API Document
1. **Register**:

    ```
    mutation Register {
      register(account: "david@test.com", password: "test1234") {
        id,
        account,
      }
    }
    ```

    response:
    ``` json
    {
      "data": {
        "register": {
          "id": 4,
          "account": "david@test.com"
        }
      }
    }
    ```

<br>

2. **Login**: 
    ```
    query login {
      login(account: "billy@test.com", password: "test1234") {
        token
      }
    }
    ```

    response:
    ``` json
    {
      "data": {
        "login": {
          "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiYWNjb3VudCI6ImJpbGx5QHRlc3QuY29tIiwibmFtZSI6IkJpbGx5IiwiYmlydGhkYXkiOiIxOTkwLTEwLTA5IiwiaWF0IjoxNjc1MjIzMjA2LCJleHAiOjE2NzUyMjMyNDJ9.smmUonBSuLbcQkXEpAtQ_XuianY3w4R7tjBP5ER8B8A"
        }
      }
    }
    ```

<br>

3. **Me**:  
    Request Headers must be like:

    | Field | Type | Description |
    | :---: | :---: | :---: |
    | Authorization | String | Access token preceding `Bearer `. For example: `Bearer x48aDD534da8ADSD1XC4SD5S` |


    ```
    query me {
      me {
        id,
        account, 
        name,
        birthday,
      }
    }
    ```

    response:
    ```json
    {
      "data": {
        "me": {
          "id": 3,
          "account": "cathy@test.com",
          "name": "Cathy",
          "birthday": "1990-10-09"
        }
      }
    }
    ```

<br>
<br>


# 研究心得
因題目要求「使用 Typescript 和 apollo-server 架設 GraphQL Server」，這 3 項對我來說都是全新的語言/ 套件/ 技術，因此先分別研究。

## GraphQL & apollo-server 
### GraphQL 出現的原因
主要希望改善 RESTful API 的缺點：
1. 一般的 RESTful API 的溝通方式，是 server 針對需要的功能來定義數個不同的 API，每一個 API 都有自己的參數跟回傳格式等，client 需要了解每個 API 的規格/ 需求資料等，才能獲得正確資訊。
2. 為了服務不同的 client（web/ app 等），server 在 API 中回傳的資料可能很多都是不需要的。
3. 若 client 所需要的資料改變（例如原本的 product API 回傳資料沒有包含發售日期，要改為包含發售日期），則 server 須同步修改 API。  

### 使用 GraphQL 的好處
1. GraphQL 會定義 server 可以提供的資料類型（schema），但不會像 RESTful API 那樣有明確的 API 來限制傳入的參數、跟取出的資料格式。
2. Client 在取資料的時候，只需要跟 server 指定想要取的資料格式、想要的欄位等等，server 就會根據 client 指定的格式回傳對應的資料。
3. 要取得什麼資料，由 client 端自行決定。

### 什麼是 Apollo-server
Apollo Server 是一個套件，可以快速且容易地建立一個 GraphQL API server。

### 架設 GraphQL Server 需要了解的重點
我認為初學者要先理解 Schema 和 Resolver 才有辦法架設一個 GraphQL server，以下是簡單說明，我在研究的過程中有同步紀錄 **[GraphQL 筆記](https://observant-ringer-2de.notion.site/GraphQL-84632b5c26c6425b893f9960cc664db7)** ，裡面有更詳細的資訊：
1. Schema：定義要回傳的資料格式長什麼樣。值得注意的是雖然叫 Schema，但並不需要和 Database 的 schema 完全相同，而是依照「要提供給 client 端的資料格式」來設計。另外，schema 的資料型態需要遵循 GraphQL 所認定的 type 。
2. Resolver：對應 Schema 的資料格式來取得與計算所需的資料，也可當作是 GraphQL API 的實作，類似 RESTful API 中的 controller 部分。



## Typescript
TypeScript 是基於 JavaScript 的嚴格語法超集，主要差異是 TypeScript 有「型別系統」。
JavaScript 是弱型別語言，可以出現非預期狀態下，型態轉換帶來的問題；而 TypeScript 在開發階段就必須為變數宣告「型別」，增加了程式碼的可讀性和可維護性，也避免 JavaScript 弱型別可能出現的問題。
同時， TypeScript 也增強 IDE 的功能，包括程式碼自動完成、介面提示、跳轉到定義、重構等。
我也簡單記錄了 **[TypeScript 學習筆記](https://observant-ringer-2de.notion.site/TypeScript-c48c4bee1180400580d157b3f1e4c715)**。


