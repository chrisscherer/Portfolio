// you can also use includes, for example:
// #include <algorithm>
#include <algorithm>
#include <numeric>
#include <iostream>
using namespace std;
vector<int> solution(int N, vector<int> &A) {
    vector<int> counters(N, 0);
    int maxInt = 0;
    
    for(int i=0;i<=A.size() - 1; i++)
    {
        if(A.at(i) == (N+1))
        {
            vector<int> hold(N, maxInt);
            counters = hold;
        }
        else if(1 <= A.at(i) && A.at(i) <= N)
        {
            int hold = A.at(i) - 1;
            counters.at(hold)++;
            if(counters.at(hold) > maxInt)
            {
                maxInt = counters.at(hold);
            }
        }
    }
    
    return counters;
}