const { exec } = require('child_process');

const WHITESPACE_REGEX = / /g;
const NEWLINE_CHARACTER = '\n';
const ACTIVE_BRANCH_SYMBOL = '*';

/**
 * Execute `git branch` and build an array of the local git branche names
 *
 * @public
 * @function branches
 * @returns {Promise<string[]|Error>}
 */
function branches() {
    return new Promise((resolve, reject) => {
        exec('git branch', (err, stdout, stderr) => {
            if (err) {
                return reject(err);
            }

            return resolve(_extractBranchNames(stdout));
        });
    });
}

/**
 * send output of `exec` off to `._extractBranchList()`
 * then verify the resulting array length
 *
 * @private
 * @function _extractBranchNames
 * @param {string} stdout
 * @returns {string[]}
 */
function _extractBranchNames(stdout) {
    const branchList = _extractBranchList(stdout);

    if (branchList.length === 0) {
        console.log(chalk.red('No local branches were found.'));

        return [];
    }

    return branchList;
}

/**
 * breaks up the string of branches from `stdout` and reduces that
 * down to an array of strings. due to how `stdout` receives the
 * result of `git branch`, there may likely be empty spaces in the
 * result. This means a simple `.split()` will result in some
 * empty value(s).
 *
 * also performs some formatting like removing `\n` and spaces
 *
 * @private
 * @function _extractBranchList
 * @param {string} str
 * @returns {string[]}
 */
function _extractBranchList(str) {
    const branchList = str.split(NEWLINE_CHARACTER)
        .reduce((sum, branch) => {
            const trimmedBranchName = branch.replace(WHITESPACE_REGEX, '');

            if (trimmedBranchName.length > 0) {
                sum.push(trimmedBranchName);
            }

            return sum;
        }, []);

    return branchList;
};

module.exports = branches;
