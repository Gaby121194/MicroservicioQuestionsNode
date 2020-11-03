
import { onlyLoggedIn } from  "../token/passport";
import * as express from "express";
import { ISessionRequest } from "../user/service";
import * as service from "./service";



export function initModule(app: express.Express) {
    // Rutas del controlador
    app
      .route("/v1/question")
      .post(onlyLoggedIn, create )
    
    app
      .route("/v1/question")
      .get(onlyLoggedIn, getAllQuestions);
    app
      .route("/v1/question/sender")
      .get(onlyLoggedIn, getQuestionsSender);
    app
      .route("/v1/question/:idQuestion")
      .put(onlyLoggedIn, response);

  
  }

  async function create(req: ISessionRequest, res: express.Response) {
    const result = await service.create(req.user.user_id, req.body);
    res.json({
      id: result.id
    });
  }

  async function getAllQuestions(req: ISessionRequest, res: express.Response) {
    const result = await service.getAll(req.user.user_id);
    res.json(result.map(u => {
      return {
        id: u._id,
        message: u.question,
        response: u.response
      };
    }));
  }

  async function getQuestionsSender(req: ISessionRequest, res: express.Response) {
    const result = await service.getQuestions(req.user.user_id);
    res.json(result.map(u => {
      return {
        id: u._id,
        message: u.question,
        response: u.response
      };
    }));
  }

  async function response(req: ISessionRequest, res: express.Response) {
    const result = await service.responseQuestion(req.user.user_id, req.params.idQuestion, req.body);
    res.json({
        response: result.response
      }
      );
  }

 