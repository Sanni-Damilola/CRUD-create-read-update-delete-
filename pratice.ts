import http, { IncomingMessage, ServerResponse } from "http";

interface resulttypes {
  message: string;
  success: boolean;
  data: null | {}[] | {};
}

interface datatypes {
  id: number;
  name: string;
}

// THANK YOU

let alldata: datatypes[] = [
  {
    id: 4,
    name: "sanni",
  },
  {
    id: 2,
    name: "bola",
  },
  {
    id: 3,
    name: "dami",
  },
];



const sortinfo = (x) => {
  return (a, b) => {
    if (a[x] < b[x]) {
      return a[x];
    } else if (a[x] > b[x]) {
      return -1;
    }
    return 0;
  };
};

const port: number = 2004;

const app = http.createServer(
  (req: IncomingMessage, res: ServerResponse<IncomingMessage>) => {
    let status: number = 404;

    const { method, url } = req;

    res.setHeader("Content-Type", "application/json");

    let body: any = [];
    let result: resulttypes = {
      success: false,
      message: "successful",
      data: null,
    };

    req.on("data", (chunk) => {
      body.push(chunk);
      console.log(body.toString());
    });

    req.on("end", () => {
      if (method === "GET" && url === "/") {
        status = 200;
        result.data = alldata;
        result.message = "successful";
        result.success = true;
      }

      if (method === "POST" && url === "/") {
        status = 201;
        alldata.push(JSON.parse(body));
        result.message = "successful";
        result.data = alldata;
        result.success = true;
      }

      if (method === "DELETE") {
        let getid = url?.split("/")[1];

        let newid = Number(getid!);

        if (newid <= alldata.length) {
          alldata = alldata.filter((el) => el.id !== newid);
          result.message = "successful";
          result.data = alldata;
          result.success = true;
        }
      }

      if (method === "PATCH") {
        let getid: string | undefined = url?.split("/")[1];

        let newid = Number(getid!);

        if (newid <= alldata.length) {
          status = 201;
          result.data = alldata[newid - 1];
          result.message = "successful";
          result.success = true;
        } else {
          result.data = null;
          result.message = "id not found";
          result.success = false;
        }
      }

      if (method === "PUT") {
        const { name } = JSON.parse(body);
        let getid: string | undefined = url?.split("/")[1];
        let newid = parseInt(getid!);
        alldata[newid - 1].name = name;

        if (newid <= alldata.length) {
          status = 201;
          result.message = "successful";
          result.success = true;
          result.data = alldata;
        } else {
          result.data = null;
          result.message = "id not found";
          result.success = false;
        }
      }
      res.end(JSON.stringify({ status, result }));
    });
  }
);

app.listen(port, () => {
  console.log("");
  console.log("server is runing".toUpperCase());
  console.log("");
});
