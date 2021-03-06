import add from ".";
import { Argv } from "yargs";
import { getNamespaces, getServices } from "../../lib/k8s/utils";
import * as config from "../../lib/config";

export const command = "k8s <subdomain>";
export const describe = "adds a route to a k8s service";

export function builder(yargs: Argv) {
  yargs
    .options({
      namespace: {
        describe: "Kubernetes Namespace",
        type: "string",
        demandOption: true
      },
      service: {
        describe: "Kubernetes Service Name",
        type: "string",
        demandOption: true
      },
      region: {
        describe: "AWS Region",
        type: "string",
        default: config.get("region")
      },
      domainName: {
        describe: "Domain Name",
        type: "string",
        default: config.get("domainName")
      },
      comment: { describe: "Comment", type: "string", alias: "c" }
    })
    .positional("subdomain", {
      description: "Subdomain to create (`xxx` for {xxx}.example.com)"
    });

  // .completion("completion", async (current, argv, done) => {
  //   if (argv.kubeNamespace === "") {
  //     const result = await getNamespaces();
  //     done(result);
  //   } else if (argv.kubeNamespace && argv.kubeService === "") {
  //     const result = await getServices(argv.kubeNamespace);
  //     done(result);
  //   } else {
  //     done(null);
  //   }
  // });
  return yargs;
}

export const handler = add;

export interface IK8sOptions {
  namespace: string;
  service: string;
}

export const k8sOptions = [
  {
    name: "namespace",
    message: "In which namespace is your service located?",
    choices: getNamespaces,
    type: "list"
  },
  {
    name: "service",
    message: "What is the name of your service?",
    choices: async (answers: IK8sOptions) => {
      return getServices(answers.namespace);
    },
    type: "list"
  }
];
