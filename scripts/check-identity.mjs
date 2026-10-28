import { execFileSync } from 'node:child_process';
const git=(...args)=>execFileSync('git',args,{encoding:'utf8'}).trim();
const fail=message=>{console.error(message);process.exit(1);};
try {
 const expected=git('config','--local','ledger.expectedEmail');
 const email=git('var','GIT_AUTHOR_IDENT');
 const committer=git('var','GIT_COMMITTER_IDENT');
 if(!expected||!email.includes(`<${expected}>`)||!committer.includes(`<${expected}>`)) fail('Commit blocked: author and committer must use the repository personal email.');
 const remote=git('remote','get-url','origin');
 if(remote!=='git@github.com:TangoJamaicaFoxtrot/TheLedger.git') fail('Push blocked: origin does not match your personal Ledger repository.');
 const ssh=git('config','--local','core.sshCommand');
 if(ssh!=='ssh -F /dev/null -o IdentitiesOnly=yes -o IdentityAgent=none -i ~/.ssh/id_ed25519_ledger') fail('Personal SSH configuration is missing or changed.');
 if(process.env.GIT_SSH_COMMAND||process.env.GIT_SSH||process.env.GIT_CONFIG_COUNT||process.env.GIT_CONFIG_PARAMETERS) fail('Remove Git environment overrides before committing or pushing.');
 console.log('Personal identity and repository configuration verified.');
} catch {fail('Personal repository setup is incomplete. See docs/SETUP.md.');}
